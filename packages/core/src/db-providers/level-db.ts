import { Document } from '../y/document'
import { DbProvider } from './db-provider'
import { LeveldbPersistence } from 'y-leveldb';
import * as Y from 'yjs';
class LevelDbProvider extends DbProvider {
    saveState?(room: string, ydoc: Document): void {
        // throw new Error('Method not implemented.');
    }
    initialize?(): void{
        // throw new Error('Method not implemented.');
    }
    ldb: LeveldbPersistence
    constructor(dir: string) {
        super();
        this.ldb = new LeveldbPersistence(dir)
    }

    async bindState(docName: string, ydoc: Document) {
        const ldb = this.ldb;
        const persistedYdoc = await ldb.getYDoc(docName)
        const newUpdates = Y.encodeStateAsUpdate(ydoc)
        await ldb.storeUpdate(docName, newUpdates)
        Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc))
        ydoc.on('update', async (update: Uint8Array) => await ldb.storeUpdate(docName, update))
    }
}
export default LevelDbProvider;