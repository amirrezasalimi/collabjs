import { useStore } from "zustand"
import { roomContext } from "../context/room"

const useIsConnected = () => {
    const { connectionStore } = roomContext()
    const status = useStore(connectionStore, store => store.status)
    return status === "connected"
}

const useIsSynced = () => {
    const { connectionStore } = roomContext()
    const synced = useStore(connectionStore, store => store.synced)
    return synced
}
export {
    useIsConnected,
    useIsSynced
}