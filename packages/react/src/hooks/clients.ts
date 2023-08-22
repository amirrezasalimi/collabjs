import { useStore } from "zustand"
import { roomContext } from "../context/room"
import { useSelf } from "./self"
import { Client } from "../types/client"
const useClients = () => {
    const ctx = roomContext()
    const clients = useStore(ctx.clientsStore, store => store.clients)
    const clientPermissions = useStore(ctx.clientsStore, store => store.clientPermissionsMap)
    const self = useSelf();
    
    const clientsFiltered = clients.map((client) => ({
        ...client,
        permission: clientPermissions[client.uid],
    })).filter((client) => client.uid !== self.data.uid) as Client[]
    return {
        clients: clientsFiltered
    }
}
export {
    useClients
};