import { StoreApi, UseBoundStore, create } from "zustand";
import { immer } from "zustand/middleware/immer";
import * as Y from "yjs";
import { ProviderType, RoomConfig, RoomStatus } from "../types/room";
import { Binder, bind } from "immer-yjs";

type State = {
    id: string,
    config?: RoomConfig,
    doc: Y.Doc,
    provider?: ProviderType,
    yImmerBinder: Binder<any>,
}

type Actions = {
    setDoc: (doc: Y.Doc) => void,
    setProvider: (provider: ProviderType) => void,
    setYImmerBinder: (binder: Binder<any>) => void,
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
    immer<State & Actions>((set,get) => {
        const doc=config?.doc ?? new Y.Doc();
        const binder=bind<any>(doc.getMap('data'))
        return {
        status: "disconnected",
        id,
        config,
        doc,
        yImmerBinder: binder,
        setDoc: (doc: Y.Doc) => {
            set((state) => {
                state.doc = doc
            })
        },
        setProvider: (provider: ProviderType) => {
            set((state) => {
                state.provider = provider
            })
        },
        setYImmerBinder: (binder: Binder<any>) => {
            set((state) => {
                state.yImmerBinder = binder
            })
        },
    }
}));

