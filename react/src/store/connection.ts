import { StoreApi, UseBoundStore, create, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { RoomStatus } from "../types/room";

type State = {
    status: RoomStatus
    synced: boolean
}
type Actions = {
    setStatus: (status: RoomStatus) => void
    setSynced: (synced: boolean) => void
}
export const makeConnectionStore = () => create(
    immer<State & Actions>((set) => ({
        status: "disconnected",
        synced: false,
        setStatus: (status: RoomStatus) => {
            set((state) => {
                state.status = status
            })
        },
        setSynced: (synced: boolean) => {
            set((state) => {
                state.synced = synced
            })
        }
    })))
export type connectionStoreReturnType = UseBoundStore<StoreApi<State & Actions>>