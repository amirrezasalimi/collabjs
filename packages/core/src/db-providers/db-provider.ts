import { Document } from '../y/document'
import * as Y from 'yjs'

export abstract class DbProvider {
    abstract saveState?(room: string, ydoc: Document): Promise<void> | void

    getRoom?: (docName: string) => Promise<{
        ydoc: Y.Doc,
    }>
    getRooms?: <filters = undefined>(filters) => Promise<{
        name: string,
        ydoc: Y.Doc,
    }[]>

    isChanged(oldDoc: Y.Doc | Document, newDoc: Y.Doc | Document): boolean {
        const oldJson = oldDoc.getMap("data").toJSON();
        const newJson = newDoc.getMap("data").toJSON();
        return JSON.stringify(oldJson) != JSON.stringify(newJson);
    }
    private applyDefaultToYjsType(data:Y.Map<any>, obj) {  
        for (const key in obj) {
            const defaultValue = obj[key];            
            if (typeof defaultValue === 'object' && !Array.isArray(defaultValue)) {
                // If the property is an object (excluding arrays), recursively apply defaults
                if (!data.has(key)) {
                    data.set(key, new Y.Map());
                }
                this.applyDefaultToYjsType(data.get(key), defaultValue);
            } else if (Array.isArray(defaultValue)) {
                // If the property is an array, create an empty Y.Array
                if (!data.has(key)) {
                    data.set(key, new Y.Array());
                }
            } else {
                // Otherwise, set the property in the Yjs map
                if (!data.has(key)) {
                    data.set(key, defaultValue);
                }
            }
        }
    }

    applyStorageDefaults(doc: Y.Doc, defaults: object) {
        const dataMap = doc.getMap("data")
        this.applyDefaultToYjsType(dataMap, defaults);
    }

    abstract initialize?(): Promise<void> | void
    abstract bindState?(room: string, ydoc: Document): Promise<void>
}