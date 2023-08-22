import { Document } from '../y/document'
import { Doc } from 'yjs'

export abstract class DbProvider {
    abstract saveState?(room: string, ydoc: Document): Promise<void> | void

    getRoom?: (docName: string) => Promise<{
        ydoc: Doc,
    }>
    getRooms?: <filters = undefined>(filters) => Promise<{
        name: string,
        ydoc: Doc,
    }[]>

    isChanged(oldDoc: Doc | Document, newDoc: Doc | Document): boolean {
        const oldJson = oldDoc.getMap("data").toJSON();
        const newJson = newDoc.getMap("data").toJSON();
        return JSON.stringify(oldJson) != JSON.stringify(newJson);
    }

    abstract initialize?(): Promise<void> | void
    abstract bindState?(room: string, ydoc: Document): Promise<void>
}