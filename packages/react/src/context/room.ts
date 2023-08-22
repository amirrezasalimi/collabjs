import { createContext, useContext } from "react";
import { StoreReturnType } from "../store/room";
import { connectionStoreReturnType } from "../store/connection";
import { clientsStoreReturnType } from "../store/clients";

export interface IRoomContext {
    roomStore: StoreReturnType
    connectionStore: connectionStoreReturnType
    clientsStore: clientsStoreReturnType
}
export const RoomContext = createContext<IRoomContext>({} as any)
export const roomContext = () => useContext(RoomContext)