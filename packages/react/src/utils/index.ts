import * as Y from "yjs";

export const yDocToJson = (doc: Y.Doc) => {
    let result: any = {}
    doc.share.forEach((value, key) => {        
        result[key] = value.toJSON()
    })
    return result;
}
export const uniqueColor = (list: string[], id: string) => {
    // Calculate an index based on the hash of the name
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = hash % list.length;

    return list[index];
}
