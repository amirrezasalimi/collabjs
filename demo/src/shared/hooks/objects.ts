import { useStorage, useStaticStorage } from "@collabjs/react";
import { Circle, Comment, Rectangle, Text } from "../models/object";
export type Obj = Rectangle | Circle | Text | Comment;
export type ObjTypes = "rectangle" | "circle" | "text" | "comment";
type ObjShortData = {
    id: string,
    index: number,
}
export const useObjectsStatic = () => {
    const [objects, set] = useStaticStorage<{
        object_data: {
            [id: string]: Obj
        }
    },
        {
            [id: string]: Obj
        }
    >(state => state.object_data)
    const edit = (obj: Partial<Obj>) => {
        if (!obj.id) return;
        set(draft => {
            draft.object_data[obj.id as string] = {
                ...draft.object_data[obj.id as string],
                ...obj
            }
        })

    }
    return {
        objects,
        edit
    }

}
export const useObject = (id: string) => {
    const [data, set] = useStorage<{
        object_data: {
            [id: string]: Obj
        }
    }, Obj>(state => {        
        return state.object_data[id]
    }, {
        object_data: {

        }
    })

    const update = (obj: Partial<Obj>) => {
        if (!obj.id) return;
        set(draft => {
            draft.object_data[obj.id as string] = {
                ...draft.object_data[obj.id as string],
                ...obj
            }
        })
    }

    return {
        data,
        update
    }
}
const useObjects = () => {
    const [_objects, setObjects] = useStorage<{
        objects: {
            [id: string]: ObjShortData
        }
    }, {
        [id: string]: ObjShortData
    }>(state => state.objects, {
        objects: {

        }
    });


    const [, setObjectsData] = useStaticStorage<{
        object_data: {
            [id: string]: Obj
        }
    },
        {
            [id: string]: Obj
        }
    >(state => state.object_data)

    const add = (obj: Partial<Obj>) => {
        const id = String(Date.now());
        obj.id = id;
        setObjectsData(draft => {
            draft.object_data[id] = obj as Obj;
        })
        setObjects(draft => {
            draft.objects[id] = {
                id,
                index: Object.keys(draft.objects).length,
            };
        })

    }
    const remove = (id: string) => {
        setObjects(draft => {
            delete draft.objects[id];
        })
        setObjectsData(draft => {
            delete draft.object_data[id];
        })
    }
    return {
        objects: _objects ?? {},
        add,
        remove
    }
}
export default useObjects;