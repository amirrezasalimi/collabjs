import { useEffect, useState } from "react";
import useRoom from "./room";
import { produce } from "immer";
import { Client } from "../types/client";
import { useStore } from "zustand";
import { roomContext } from "../context/room";
const useSelf = <ClientData>() => {
    const { provider } = useRoom();
    const room = roomContext();
    const self = useStore(room.clientsStore, state => state.self);
    const _data = provider?.awareness?.getLocalState() as Client;
    const data = {
        ..._data,
        uid: provider?.awareness?.clientID ?? -1,
        permission: self.permission,
    } as Client & ClientData;

    const [forceRender, setForceRender] = useState(0);
    useEffect(() => {
        const onChange = () => {
            if (provider && !provider.awareness) return;
            setForceRender(forceRender + 1);
        }
        if (provider?.awareness) {
            provider.awareness.on('change', onChange)
        }
        return () => {
            if (provider?.awareness) {
                provider.awareness.off('change', onChange)
            }
        }
    }, [])
    const update = (
        draft: (data: Client & ClientData) => void
    ) => {
        if (provider?.awareness) {
            const oldData = provider?.awareness?.getLocalState() as Client;
            const newUpdate = produce(oldData, draft);
            provider.awareness.setLocalState(
                newUpdate
            )
        }
    }
    return {
        data,
        update
    }
}
export {
    useSelf
}