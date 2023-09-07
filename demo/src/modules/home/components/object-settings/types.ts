import { ObjTypes } from "../../../../shared/hooks/objects"

type componentTypes = "number" | "color" | "text" | "select" | "boolean"
export interface Component {
    type: componentTypes
    name: string
    label: string
    options?: string[]
    value?: any
    onChange?: (value: any) => void
}
export type groupTypes = "general" | "size" | "stroke" | "fill" | "radius"
export const settingsGroups: Record<groupTypes, Component[]> = {
    "general": [
        {
            "type": "text",
            "name": "name",
            "label": "Name",
        },
        {
            "type": "number",
            "name": "x",
            "label": "X",
        },
        {
            "type": "number",
            "name": "y",
            "label": "Y",
        },
    ],
    "size": [
        {
            "type": "number",
            "name": "width",
            "label": "Width",
        },
        {
            "type": "number",
            "name": "height",
            "label": "Height",
        }
    ],
    "radius": [
        {
            "type": "number",
            "name": "radius",
            "label": "Radius",
        },
    ],
    "stroke": [
        {
            "type": "number",
            "name": "strokeWidth",
            "label": "Width",
        },
        {
            "type": "color",
            "name": "strokeColor",
            "label": "Color",
        },
    ],
    "fill": [
        {
            "type": "color",
            "name": "fillColor",
            "label": "Fill Color",
        }
    ],
}

export const objectsSettings:Partial< Record<ObjTypes, groupTypes[]>> = {
    "rectangle": [
        "general",
        "size",
        "fill",
        "stroke",
        "radius"
    ],
    "circle": [
        "general",
        "fill",
        "stroke",
    ],
}
