import { useStorage } from "@collabjs/react";

const useSelect = () => {
    const [selected, setSelected] = useStorage<{
        selected: {
            [objId: string]: {
                [userId: string]: boolean
            }
        }
    }, {
        [objId: string]: {
            [userId: string]: boolean
        }
    }>(state => state.selected, {
        selected: {}
    });

    const isObjSelected = (objId: string) => {
        return Object.keys(selected[objId] ?? {}).length > 0;
    }

    const selectObj = (objId: string, userId: string) => {
        unselect(userId);
        setSelected(draft => {
            if (!draft.selected[objId]) {
                draft.selected[objId] = {};
            }
            draft.selected[objId][String(userId)] = true;
        })
    }
    const unselect = (userId: string) => {
        setSelected(draft => {
            Object.keys(draft.selected).forEach(objId => {
                delete draft.selected[objId][userId];
            })
        })
    }
    const getObjSelectedUsers = (objId: string) => {
        return Object.keys(selected[objId] ?? {});
    }
    const getUserSelectedObjs = (userId: string) => {
        if (!selected) return [];
        return Object?.keys(selected)?.filter(objId => selected[objId][userId])??[];
    }

    return {
        selected: selected ?? {},
        isObjSelected,
        getObjSelectedUsers,
        selectObj,
        unselect,
        getUserSelectedObjs
    }
}
export default useSelect;