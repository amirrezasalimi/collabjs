import * as Y from "yjs";
import useRoom from "./room";
import { useMemo } from "react";
import { STORAGE_MAP } from "../constants";

const useUndo = () => {
    const { doc } = useRoom();
    const undoManager = useMemo(() => new Y.UndoManager(doc.getMap(STORAGE_MAP)), []);

    return {
        undo: undoManager.undo,
        redo: undoManager.redo,
        canUndo: undoManager.canUndo,
        canRedo: undoManager.canRedo
    }
}
export {
    useUndo
}