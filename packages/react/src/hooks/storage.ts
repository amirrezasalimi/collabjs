import { JSONArray } from "immer-yjs"
import useRoom from "./room"
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';

export function useStorage<State, Selection>(selector: (state: State) => Selection) {
    type FakeState = State & JSONArray
    const { yImmerBinder } = useRoom();
    const selection = useSyncExternalStoreWithSelector(
        yImmerBinder.subscribe,
        yImmerBinder.get,
        yImmerBinder.get,
        selector,
    )
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