import { StoreApi, UseBoundStore, create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Client } from "../types/client";

type State = {
    self: {
        permission?: "edit" | "view"
    }
    clients: Client[]
    clientPermissionsMap: Record<string, string>
}
type Actions = {
    setClients: (clients: Client[]) => void
    setClientPermission: (id: number, permission: string) => void
    setSelf: (self: Partial<Client>) => void
}

export const makeClientsStore = () => create(
    immer<State & Actions>((set) => ({
        self: {
            permission: "view"
        },
        clients: [],
        clientPermissionsMap: {},
        setClients: (clients: Client[]) => {
            set((state) => {
                state.clients = clients
            })
        },
        setClientPermission: (id: number, permission: string) => {
            set((state) => {
                state.clientPermissionsMap[id] = permission
            })
        },
        setSelf: (self: Partial<Client>) => {
            set((state) => {
                state.self = {
                    ...state.self,
                    ...self
                }
            })
        }

    })))
export type clientsStoreReturnType = UseBoundStore<StoreApi<State & Actions>>
