import { ObjTypes } from "../hooks/objects";

export interface Obj {
    id: string;
    name: string;
    type: ObjTypes;
    creatorId: string;
    x: number;
    y: number;
    radius: number;
}

export interface Stroke {
    strokeWidth: number;
    strokeColor: string;
}
export interface Rectangle extends Obj, Stroke {
    width: number;
    height: number;
    radius: number;
    fillColor: string;

}
export interface Circle extends Obj, Stroke {
    radius: number;
    fillColor: string;
}
export interface Text extends Obj {
    text: string;
    fontSize: number;
}
export interface Comment extends Obj {
    text: string;
}