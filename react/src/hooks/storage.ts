import { JSONArray, bind } from "immer-yjs"
import useRoom from "./room"
import { useSyncExternalStoreWithSelector } from 'use-sync-external-store/with-selector';


export function useStorage<State, Selection>(selector: (state: State) => Selection, defaults?: State) {
    type FakeState = State & JSONArray

    const { doc } = useRoom();
    const binder = bind<FakeState>(doc.getMap('data'))

    const selection = useSyncExternalStoreWithSelector(
        binder.subscribe,
        binder.get,
        binder.get,
        selector,
    )

    if (defaults) {
        binder.update(draft => {
            Object.keys(defaults).forEach((key: any) => {
                if (typeof draft[key] != 'undefined') return
                // @ts-ignore
                draft[key] = defaults[key]
            })
        })
    }
    return [selection, binder.update] as [
        Selection,
        (updater: (draft: FakeState) => void) => void
    ]
}