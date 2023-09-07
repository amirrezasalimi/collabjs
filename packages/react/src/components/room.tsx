import { useLayoutEffect, useRef } from "react"
import { RoomContext, roomContext } from "../context/room"
import { StoreReturnType, makeRoomStore } from "../store/room"
import { RoomConfig, RoomStatus } from "../types/room"
import { useStore } from "zustand"
import { SocketIOProvider } from "../y/provider"
import { makeConnectionStore } from "../store/connection"
import { makeClientsStore } from "../store/clients"
import { Client } from "../types/client"

interface RoomProps {
    id: string,
    config?: RoomConfig,
}
interface IRoomProvider extends RoomProps {
    children: React.ReactNode
    storage?: object
}
interface IRoom {
    children: React.ReactNode
    storage?: object
}
const Room = ({ children, storage }: IRoom) => {
    const store = roomContext()
    const {
        id,
        config,
        provider,
        doc,
        setProvider,
        yImmerBinder
    } = useStore(store.roomStore);


    const setClients = useStore(store.clientsStore, (state) => state.setClients);
    const setSelf = useStore(store.clientsStore, (state) => state.setSelf);

    const setSynced = useStore(store.connectionStore, (state) => state.setSynced);
    const setStatus = useStore(store.connectionStore, (state) => state.setStatus);

    const isProviderSet = useRef(false);

    useLayoutEffect(() => {
        if (!provider) {
            const makeSocketIoProvider = () => {
                const _provider = new SocketIOProvider(
                    config?.url ?? 'ws://localhost:1234',
                    id,
                    doc,
                    {
                        autoConnect: true,
                        // disableBc: true, 
                        disableBc: true,
                        auth: {
                            ...config?.auth,
                            room: id,
                            storage
                        },
                    });
                    
                _provider.socket.on('permission', ({ permission }: {
                    permission: "edit" | "view" | undefined
                }) => {
                    setSelf({
                        permission
                    })
                })

                return _provider;
            };

            const _provider = config?.provider ?? makeSocketIoProvider();
            const syncChange = (isSync: boolean) => {
                setSynced(isSync);
            }
            const statusChange = ({ status: _status }: { status: string }) => {
                if (!!_status) setStatus(_status as RoomStatus);
            }
            const awarenessChange = () => {
                if (!_provider.awareness) return;
                const clientsMap = _provider.awareness.getStates();

                const clients = Array.from(clientsMap.keys()).map(key => {
                    return {
                        uid: key,
                        ...clientsMap.get(key)
                    }
                });
                setClients(clients as unknown as Client[]);
            }

            _provider.on('sync', syncChange)
            _provider.on('status', statusChange)

            if (typeof _provider.awareness != "undefined") {
                awarenessChange();
                _provider.awareness.on('change', awarenessChange)
            }
            setProvider(_provider);

            isProviderSet.current = true;

            return () => {

                // cleanup
                if (_provider) {
                    _provider.off?.("sync", syncChange);
                    _provider.off?.("status", statusChange);
                    if (typeof _provider.awareness != "undefined") {
                        _provider.awareness.off('change', awarenessChange)
                    }
                    _provider.disconnect?.();
                    _provider.destroy?.();

                    (_provider as SocketIOProvider)?.socket?.disconnect?.();
                    (_provider as SocketIOProvider)?.socket?.close?.();
                    yImmerBinder?.unbind();
                }
            }
        }
    }, [setStatus]);

    return children;
}

export const RoomProvider = ({
    children,
    id,
    config,
    storage
}: IRoomProvider) => {

    return (
        <RoomContext.Provider value={
            {
                roomStore: makeRoomStore({
                    id,
                    config,
                }) as StoreReturnType,
                connectionStore: makeConnectionStore(),
                clientsStore: makeClientsStore(),
            }
        } >
            <Room storage={storage}>
                {children}
            </Room>
        </RoomContext.Provider>
    )
}