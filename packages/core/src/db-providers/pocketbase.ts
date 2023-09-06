import { Document } from '../y/document'
import { DbProvider } from './db-provider'
import * as Y from 'yjs';


// @ts-ignore
import Schema from "./pocketbase-schema.json";
import Pocketbase, { RecordFullListQueryParams } from 'pocketbase';
import { yDocToJson } from '../y/utils';
interface PocketbaseDbConfig {
    url: string,
    admin?: {
        email: string,
        password: string
    }
}
class PocketbaseProvider extends DbProvider {
    config: PocketbaseDbConfig
    pb: Pocketbase
    constructor(config: PocketbaseDbConfig) {
        super()
        this.config = config;
    }
    async initialize() {
        this.pb = new Pocketbase(this.config.url)
        if (this.config.admin) {
            await this.pb.admins.authWithPassword(this.config.admin.email, this.config.admin.password)
        }
        try {
            await this.pb.collections.getOne('rooms')
        } catch (e) {
            await this.pb.collections.import([
                Schema as any
            ])
            console.log("pocketbase schema imported");
        }
    }

    private async getRoomData(name: string) {
        const data = await this.pb.collection("rooms").getFirstListItem(`name="${name}"`)
        if (data) {
            return data;
        }

    }
    encodeUpdateAsString(update: Uint8Array) {
        return Buffer.from(update).toString('base64');
    }
    decodeUpdateFromString(update: string) {
        return Buffer.from(update, 'base64');
    }
    base64ToDoc(base64: string) {
        const doc = new Y.Doc();
        Y.applyUpdate(doc, this.decodeUpdateFromString(base64))
        return doc;
    }

    async bindState(docName: string, ydoc: Document | Y.Doc) {
        try {
            const data = await this.pb.collection("rooms").getFirstListItem(`name="${docName}"`)
            if (data) {
                const updates = this.decodeUpdateFromString(data.storage);
                if (updates) {
                    Y.applyUpdate(ydoc, updates)
                }
                // update active field
                await this.pb.collection("rooms").update(data.id, {
                    active: true
                })
            }
        } catch (e) {
            console.log("room storage not found");
        }
    }

    async saveState(docName: string, ydoc: Document) {
        const newUpdates = Y.encodeStateAsUpdate(ydoc);
        // check exists
        try {
            const data = await this.getRoomData(docName);

            if (data) {
                console.log("update room");
                const oldDoc = this.base64ToDoc(data.storage);

                if (this.isChanged(oldDoc, ydoc)) {
                    await this.pb.collection("rooms").update(data.id, {
                        storage: this.encodeUpdateAsString(newUpdates),
                        active: false
                    })
                } else {
                    // fix this (update time)
                    await this.pb.collection("rooms").update(data.id, {
                        active: false
                    })
                }
            }
        } catch (e) {
            console.log("create new room", e);
            //    create new
            await this.pb.collection("rooms").create({
                name: docName,
                storage: this.encodeUpdateAsString(newUpdates),
                active: false
            })
        }
    }
    /* 
        async getRoom(name: string) {
            const ydoc = new Y.Doc();
            await this.bindState(name, ydoc);
            return {
                ydoc,
            }
        }
        async getRooms(filters: Partial<RecordFullListQueryParams>) {
            const rooms = await this.pb.collection("rooms").getFullList(filters);
            return rooms.map((room) => {
                const ydoc = new Y.Doc();
                Y.applyUpdate(ydoc, this.decodeUpdateFromString(room.storage))
                return {
                    name: room.name,
                    ydoc
                }
            })
        } */
}
export default PocketbaseProvider;