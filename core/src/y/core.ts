import * as Y from 'yjs'
import { Namespace, Server, Socket } from 'socket.io'
import * as AwarenessProtocol from 'y-protocols/awareness'
import { Document } from './document'
import { Observable } from 'lib0/observable'
import { DbProvider } from '../types/db-provider'
import { decoding } from "lib0"

type AuthenticateCustom = {
    error: boolean,
    message: string
}
type AuthenticatePermission = "edit" | "view"
type AuthenticateTypes = AuthenticatePermission | AuthenticateCustom | boolean
type AuthenticateResult = AuthenticateTypes | Promise<AuthenticateTypes>
/**
 * YSocketIO instance cofiguration. Here you can configure:
 * - gcEnabled: Enable/Disable garbage collection (default: gc=true)
 * - authenticate: The callback to authenticate the client connection
 */
export interface Configuration {
    events?: {
        onRoomCreated?: (roomName: string, doc: Document) => void
        onRoomDestroyed?: (roomName: string, doc: Document) => void

        onClientJoined?: (roomName: string, doc: Document, socket: Socket) => void
        onClientLeft?: (roomName: string, doc: Document, socket: Socket) => void
    },

    db: DbProvider
    /**
     * Enable/Disable garbage collection (default: gc=true)
     */
    gcEnabled?: boolean
    /**
     * The directory path where the persistent Level database will be stored
     */
    /**
     * Callback to authenticate the client connection.
     *
     *  It can be a promise and if it returns true, the connection is allowed; otherwise, if it returns false, the connection is rejected.
     * @param handshake Provided from the handshake attribute of the socket io
     */
    authenticate?: (handshake: { [key: string]: any }) => AuthenticateResult
}

/**
 * YSocketIO class. This handles document synchronization.
 */
export class CollabCore extends Observable<string> {
    /**
     * @type {Map<string, Document>}
     */
    private readonly _documents: Map<string, Document> = new Map<string, Document>()
    /**
     * @type {Server}
     */
    private readonly io: Server
    /**
     * @type {string | undefined | null}
     */

    socketPermission: Record<string, Record<string, "edit" | "view">> = {}

    /**
     * @type {Configuration}
     */
    private readonly configuration: Configuration

    /**
     * YSocketIO constructor.
     * @constructor
     * @param {Server} io Server instance from Socket IO
     * @param {Configuration} configuration (Optional) The YSocketIO configuration
     */
    constructor(io: Server, configuration: Configuration) {
        super()
        this.io = io
        this.configuration = configuration
    }

    registerEvents(events: Configuration["events"]) {
        this.configuration.events = events;
    }

    hasPermission(room: string, socket: Socket, permission: "edit" | "view"): boolean {
        if (this.socketPermission?.[room]?.[socket.id] == null) return false
        return this.socketPermission[room][socket.id] === permission
    }
    roomSockets: Record<string, Record<string, Socket>> = {}

    broadcastToRoom(room: string, event: string, data: any) {
        if (this.roomSockets[room] == null) return
        Object.values(this.roomSockets[room]).forEach(socket => {
            socket.emit(event, data)
        })
    }
    /**
     * YSocketIO initialization.
     *
     *  This method set ups a dynamic namespace manager for namespaces that match with the regular expression `/^\/yjs\|.*$/`
     *  and adds the connection authentication middleware to the dynamics namespaces.
     *
     *  It also starts socket connection listeners.
     * @type {() => void}
     */
    public async initialize() {
        await this.configuration.db.initialize?.()
        const dynamicNamespace = this.io.of(/^\/yjs\|.*$/)

        dynamicNamespace.use(async (socket, next) => {
            if ((this.configuration?.authenticate) == null) return next()

            const roomName = socket.handshake.auth.room;

            if (this.socketPermission[roomName] == null) this.socketPermission[roomName] = {}
            let authRes: AuthenticateResult;
            try {
                authRes = await this.configuration.authenticate(socket.handshake)
                if (typeof authRes === 'boolean') {
                    if (authRes) {
                        // set permission of user
                        this.socketPermission[
                            roomName
                        ][socket.id] = "edit";
                        return next()
                    }
                    throw new Error('Authentication failed')
                } else {
                    if (typeof authRes == "object" && authRes.error) throw new Error(authRes.message)
                    if (typeof authRes == "string") {
                        // set permission of user
                        this.socketPermission[roomName][socket.id] = authRes
                        return next()
                    }
                }
            } catch (e) {
                throw new Error(`Error on authenticate: ${e}`)
            }
        })

        dynamicNamespace.on('connection', async (socket) => {
            const namespace = socket.nsp.name.replace(/\/yjs\|/, '')
            const roomName = socket.handshake.auth.room;

            if (this.roomSockets[roomName] == null) this.roomSockets[roomName] = {}
            this.roomSockets[roomName][socket.id] = socket;
            const doc = await this.initDocument(namespace, socket.nsp, this.configuration?.gcEnabled)

            // emit permission
            socket.emit("permission", {
                permission: this.socketPermission[roomName][socket.id]
            })

            this.configuration?.events?.onClientJoined(namespace, doc, socket);

            // broad cast awareness update to all broadcastToRoom
        
             

            this.initSyncListeners(socket, doc)
            this.initAwarenessListeners(socket, doc)

            this.initSocketListeners(socket, doc)

            this.startSynchronization(socket, doc)
        })
    }

    /**
     * The document map's getter. If you want to delete a document externally, make sure you don't delete
     * the document directly from the map, instead use the "destroy" method of the document you want to delete,
     * this way when you destroy the document you are also closing any existing connection on the document.
     * @type {Map<string, Document>}
     */
    public get documents(): Map<string, Document> {
        return this._documents
    }

    /**
     * This method creates a yjs document if it doesn't exist in the document map. If the document exists, get the map document.
     *
     *  - If document is created:
     *      - Adds the new document to the documents map.
     *      - Emit the `document-loaded` event
     * @private
     * @param {string} name The name for the document
     * @param {Namespace} namespace The namespace of the document
     * @param {boolean} gc Enable/Disable garbage collection (default: gc=true)
     * @returns {Promise<Document>} The document
     */
    private async initDocument(name: string, namespace: Namespace, gc: boolean = true): Promise<Document> {
        const doc = this._documents.get(name) ?? (new Document(name, namespace, {
            onUpdate: (doc, update) => this.emit('document-update', [doc, update]),
            onChangeAwareness: (doc, update) => this.emit('awareness-update', [doc, update]),
            onDestroy: async (doc) => {
                this._documents.delete(doc.name)
                this.emit('document-destroy', [doc])
            }
        }))
        doc.gc = gc
        if (!this._documents.has(name)) {
            if (this.configuration.db != null) {
                await this.configuration.db.bindState(name, doc)
            }
            this._documents.set(name, doc)
            this.emit('document-loaded', [doc])
            this.configuration?.events?.onRoomCreated?.(name, doc);
        }
        return doc
    }



    /**
     * This function initializes the socket event listeners to synchronize document changes.
     *
     *  The synchronization protocol is as follows:
     *  - A client emits the sync step one event (`sync-step-1`) which sends the document as a state vector
     *    and the sync step two callback as an acknowledgment according to the socket io acknowledgments.
     *  - When the server receives the `sync-step-1` event, it executes the `syncStep2` acknowledgment callback and sends
     *    the difference between the received state vector and the local document (this difference is called an update).
     *  - The second step of the sync is to apply the update sent in the `syncStep2` callback parameters from the server
     *    to the document on the client side.
     *  - There is another event (`sync-update`) that is emitted from the client, which sends an update for the document,
     *    and when the server receives this event, it applies the received update to the local document.
     *  - When an update is applied to a document, it will fire the document's "update" event, which
     *    sends the update to clients connected to the document's namespace.
     * @private
     * @type {(socket: Socket, doc: Document) => void}
     * @param {Socket} socket The socket connection
     * @param {Document} doc The document
     */
    private readonly initSyncListeners = (socket: Socket, doc: Document): void => {
        socket.on('sync-step-1', (stateVector: Uint8Array, syncStep2: (update: Uint8Array) => void) => {
            if (
                !this.isReadUpdate(stateVector) && !this.hasPermission(doc.name, socket, "edit")
            ) {
                return
            }
            syncStep2(Y.encodeStateAsUpdate(doc, new Uint8Array(stateVector)))

        })

        socket.on('sync-update', (update: Uint8Array) => {
            if (
                !this.isReadUpdate(update) && !this.hasPermission(doc.name, socket, "edit")
            ) {
                return
            }
            Y.applyUpdate(doc, update, null)
        })
    }
    isReadUpdate(update: Uint8Array): boolean {
        const decoder = decoding?.createDecoder(update)
        const type = decoding?.readVarUint(decoder)

        const messageYjsSyncStep1 = 0 // this step is not for writing update
        try {
            return type === messageYjsSyncStep1;
        } catch (e) {
            return false
        }
    }

    /**
     * This function initializes socket event listeners to synchronize awareness changes.
     *
     *  The awareness protocol is as follows:
     *  - A client emits the `awareness-update` event by sending the awareness update.
     *  - The server receives that event and applies the received update to the local awareness.
     *  - When an update is applied to awareness, the awareness "update" event will fire, which
     *    sends the update to clients connected to the document namespace.
     * @private
     * @type {(socket: Socket, doc: Document) => void}
     * @param {Socket} socket The socket connection
     * @param {Document} doc The document
     */
    private readonly initAwarenessListeners = (socket: Socket, doc: Document): void => {
        socket.on('awareness-update', (_update: ArrayBuffer) => {
            AwarenessProtocol.applyAwarenessUpdate(doc.awareness, new Uint8Array(_update), socket)
        })
    }

    /**
     *  This function initializes socket event listeners for general purposes.
     *
     *  When a client has been disconnected, check the clients connected to the document namespace,
     *  if no connection remains, emit the `all-document-connections-closed` event
     * @private
     * @type {(socket: Socket, doc: Document) => void}
     * @param {Socket} socket The socket connection
     * @param {Document} doc The document
     */
    private readonly initSocketListeners = (socket: Socket, doc: Document): void => {
        socket.on('disconnect', async () => {
            delete this.roomSockets[doc.name][socket.id]
            const sockets = await socket.nsp.fetchSockets();

            this.configuration?.events?.onClientLeft(doc.name, doc, socket);

            if (sockets.length === 0) {
                await this.configuration.db.saveState?.(doc.name, doc)

                this.emit('all-document-connections-closed', [doc])
                if (this.configuration != null) {
                    await doc.destroy()
                }
                this.configuration?.events?.onRoomDestroyed?.(doc.name, doc);
            }
        })
    }

    /**
     * This function is called when a client connects and it emit the `sync-step-1` and `awareness-update`
     * events to the client to start the sync.
     * @private
     * @type {(socket: Socket, doc: Document) => void}
     * @param {Socket} socket The socket connection
     * @param {Document} doc The document
     */
    private readonly startSynchronization = (socket: Socket, doc: Document): void => {
        socket.emit('sync-step-1', Y.encodeStateVector(doc), (update: Uint8Array) => {
            Y.applyUpdate(doc, new Uint8Array(update), this)
        })
        socket.emit('awareness-update', AwarenessProtocol.encodeAwarenessUpdate(doc.awareness, Array.from(doc.awareness.getStates().keys())))
    }
}
