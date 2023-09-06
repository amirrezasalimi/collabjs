import { JSONArray } from "immer-yjs"
import useRoom from "./room"
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';
import { useIsConnected } from "./connection";
import { useRef } from "react";

export function useStorage<State, Selection>(selector: (state: State) => Selection, defaults?: State) {
    type FakeState = State & JSONArray

    const { yImmerBinder } = useRoom();
    const isConnected = useIsConnected();
    const selection = useSyncExternalStoreWithSelector(
        yImmerBinder.subscribe,
        yImmerBinder.get,
        yImmerBinder.get,
        selector,
    )
    const defaultAlreadySet = useRef(false)

    if (defaults && !defaultAlreadySet.current && isConnected) {
        yImmerBinder.update(draft => {
            Object.keys(defaults).forEach((key: any) => {
                if (typeof draft[key] != 'undefined') return
                // @ts-ignore
                // draft[key] = defaults[key]
                // alert(`set defaults ${key}`)
            });
            defaultAlreadySet.current = true;
        })
    }
    return [selection, yImmerBinder.update] as [
        Selection,
        (updater: (draft: FakeState) => void) => void
    ]
}

export const useStaticStorage = <State, Selection>(selector: (state: State) => Selection) => {
    const { yImmerBinder } = useRoom();
    type FakeState = State & JSONArray

    const get = () => {
        return selector(yImmerBinder.get())
    }
    return [get, yImmerBinder.update] as [() => Selection, (updater: (draft: FakeState) => void) => void]
}