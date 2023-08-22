import { decoding } from "lib0"
import * as Y from "yjs"
export const getClientIdOfUpdate = (update: Uint8Array) => {
    const decoder = decoding.createDecoder(update)
    return decoding.readVarUint(decoder)
}
export function getAllSharedTypes(yjsContent: Y.Doc) {
    const sharedTypes = [];

    // Recursive function to traverse Yjs content and find shared types
    function traverse(content) {
        content.forEach((value) => {
            if (value instanceof Y.Map || value instanceof Y.Array || value instanceof Y.Text) {
                sharedTypes.push(value);
            } else if (value instanceof Y.Item) {
                // Handle custom shared types or other nested structures if needed
            }
        });
    }

    // Start traversal from the top-level Yjs content
    traverse(yjsContent);

    return sharedTypes;
}
export const yDocToJson = (doc: Y.Doc) => {
    const jsonObject = {};

    // Iterate through the Yjs document's content and extract relevant data
    getAllSharedTypes(doc).forEach((value: Y.Array<any> | Y.Map<any>, key) => {
        jsonObject[key] = value.toJSON();
    });
    return jsonObject;
}