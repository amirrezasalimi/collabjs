import { StoreApi, UseBoundStore, create } from "zustand";
import { immer } from "zustand/middleware/immer";
import * as Y from "yjs";
import { ProviderType, RoomConfig, RoomStatus } from "../types/room";

type State = {
    id: string,
    config?: RoomConfig,
    doc: Y.Doc,
    provider?: ProviderType,
}

type Actions = {
    setDoc: (doc: Y.Doc) => void,
    setProvider: (provider: ProviderType) => void,
}
interface StoreProps {
    id: string,
    config?: RoomConfig,
}
export type StoreReturnType = UseBoundStore<StoreApi<State & Actions>>

export const makeRoomStore = ({
    id,
    config
}: StoreProps) => create(
    immer<State & Actions>((set) => ({
        status: "disconnected",
        id,
        config,
        doc: config?.doc ?? new Y.Doc(),
        setDoc: (doc: Y.Doc) => {
            set((state) => {
                state.doc = doc
            })
        },
        setProvider: (provider: ProviderType) => {
            set((state) => {
                state.provider = provider
            })
        }
    })));

