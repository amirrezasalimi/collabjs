import * as Y from 'yjs'
import { Observable } from 'lib0/observable'
import * as AwarenessProtocol from 'y-protocols/awareness'

export type RoomStatus = "connected" | "disconnected"
export interface ProviderType extends Observable<string> {
    awareness?: AwarenessProtocol.Awareness
    connect?: () => void
    disconnect?: () => void
}

export type RoomConfig = {
    doc?: Y.Doc,
    url: string,
    auth?: {
        token: string
    }
    provider?: ProviderType
}
