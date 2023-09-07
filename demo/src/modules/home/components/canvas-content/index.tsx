import { UserCursors } from "../users";
import { useEffect, useRef } from "react";
import { Circle, Obj, Rectangle } from "../../../../shared/models/object";
import useSelect from "../../../../shared/hooks/selection";
import useObjects, { ObjTypes, useObject, useObjectsStatic } from "../../../../shared/hooks/objects";
import { getUserId } from "../../../../shared/utils/user";

interface ObjectRenderProps {
    id: string,
    mouseDown?: () => void
}
const ObjectRender = ({ id, mouseDown }: ObjectRenderProps) => {
    const { data } = useObject(id);
    const selection = useSelect();

    if (!data) return null;
    const obj = data;
    const userId = getUserId();
    const select = () => {
        selection.selectObj(obj.id, userId);
    }
    let style: React.CSSProperties = {}
    if (obj.type === "rectangle") {
        const rect = obj as Rectangle;
        style = {
            width: rect.width,
            height: rect.height,
            background: rect.fillColor,
            left: obj.x,
            top: obj.y,
            position: "absolute",
            borderRadius: rect.radius,
            border: `${rect.strokeWidth}px solid ${rect.strokeColor}`
        }
    }
    if (obj.type === "circle") {
        const circle = obj as Circle;
        style = {
            background: circle.fillColor,
            width: circle.radius * 2,
            height: circle.radius * 2,
            left: obj.x,
            top: obj.y,
            position: "absolute",
            borderRadius: "50%",
        }
    }
    const selected = selection.isObjSelected(obj.id);
    return <div
        onMouseDown={mouseDown}
        onClick={select} style={style} >
        {
            selected &&
            <div className="absolute w-[110%] h-[110%] left-[-5%] top-[-5%]  rounded-md to-inherit opacity-30 pointer-events-none"
                style={{
                    background: "#000"
                }}
            />
        }
    </div>

}
export const CanvasContent = () => {
    const selection = useSelect();

    const { objects, add } = useObjects();
    const objectsStatic = useObjectsStatic();
    const userId = getUserId();
    const objectsArray = Object.keys(objects);
    const dropTarget = useRef<HTMLDivElement>(null);

    const draggingObj = useRef<string | null>(null);
    const unselect = (e: any) => {
        if (e.target === dropTarget.current && !draggingObj.current) {
            selection.unselect(getUserId());
        }
    }

    const onMove = (e: MouseEvent) => {
        if (!draggingObj.current || !dropTarget.current) return;

        const obj = objectsStatic.objects()[draggingObj.current];

        let w = 0;
        let h = 0;
        if (obj.type === "rectangle") {
            const rect = obj as Rectangle;
            w = rect.width;
            h = rect.height;
        }
        if (obj.type === "circle") {
            const circle = obj as Circle;
            w = circle.radius * 2;
            h = circle.radius * 2;
        }
        // move object ,  from exact position of mosue over the object , not from the top left corner
        const offsetX = e.clientX - dropTarget.current.getBoundingClientRect().left - w / 2;
        const offsetY = e.clientY - dropTarget.current.getBoundingClientRect().top - h / 2;

        objectsStatic.edit({
            id: draggingObj.current,
            x: offsetX,
            y: offsetY
        });
    }

    const mouseUp = () => {
        draggingObj.current = null;
    }

    useEffect(() => {
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", mouseUp);
        return () => {
            document.removeEventListener("mousemove", onMove);
            document.removeEventListener("mouseup", mouseUp);
        }
    }, [])
    return <div
        onClick={unselect}
        ref={dropTarget}
        className="canvas border-1 border-white fixed left-[calc(220px+16px)] w-[calc((100%-2*220px)-32px)] h-full z-[-2]"
        onDragOver={(e) => {
            e.preventDefault();
        }}
        onDrop={
            (e) => {
                if (!dropTarget.current) return;
                const type = e.dataTransfer.getData("text");
                if (!type) return;
                const num = objectsArray.length + 1;
                const offsetX = e.clientX - dropTarget.current.getBoundingClientRect().left;
                const offsetY = e.clientY - dropTarget.current.getBoundingClientRect().top;

                const obj: Partial<Obj> = {
                    type: type as ObjTypes,
                    name: `${type} ${num}`,
                    creatorId: userId,
                    x: offsetX,
                    y: offsetY,
                }
                if (type === "rectangle") {
                    const ob = obj as Rectangle;
                    ob.width = 100;
                    ob.height = 100;
                    ob.fillColor = "#F55C5C";
                    ob.radius = 8;
                }
                if (type === "circle") {
                    const ob = obj as Circle;
                    ob.radius = 50;
                    ob.fillColor = "#F55C5C";
                }

                add(obj);
            }
        }
    >
        {
            objectsArray.map((id) => {
                const obj = objects[id];
                return <ObjectRender
                    key={id}
                    mouseDown={() => {
                        draggingObj.current = String(id);
                        selection.selectObj(id, getUserId());
                    }}
                    id={
                        obj.id as string
                    } />;
            })
        }
        <UserCursors />
    </div>;
}