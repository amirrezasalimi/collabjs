import { ReactNode } from "react";
import { useObject, useObjectsStatic } from "../../../../shared/hooks/objects";
import useSelect from "../../../../shared/hooks/selection";
import { getUserId } from "../../../../shared/utils/user";
import { ColorComponent } from "./components/color";
import { InputComponent } from "./components/input";
import { Component, groupTypes, objectsSettings, settingsGroups } from "./types";


interface ComponentProps {
    component: Component
    onChange: (value: any) => void
}
const ComponentEl = ({ component, onChange }: ComponentProps) => {
    let cmp: ReactNode;
    switch (component.type) {
        case "number":
            cmp = <InputComponent  {...component} onChange={onChange} type="number" />
            break;
        case "text":
            cmp = <InputComponent  {...component} onChange={onChange} type="text" />
            break;
        case "color":
            cmp = <ColorComponent  {...component} onChange={onChange} />
            break;

    }
    return <div>
        <div className="text-sm font-semibold pb-1">
            {component.label}
        </div>
        {cmp}
    </div>;
}
interface GroupProps {
    objectId: string
    name: groupTypes
    onChange: (key: string, value: any) => void
}
const GroupRenderer = ({
    objectId,
    name,
    onChange
}: GroupProps) => {
    const { data } = useObject(objectId);

    return <>
        {
            settingsGroups[name].map((component, i) => {
                return <ComponentEl key={i} component={{
                    ...component,
                    value: data[component.name] ?? ""
                }}
                    onChange={(value) => {
                        onChange(component.name, value);
                    }}
                />
            })
        }
    </>
}
const Settings = () => {
    const { objects, edit } = useObjectsStatic();
    const selection = useSelect();

    const userId = getUserId();
    const userSelectedObj = selection.getUserSelectedObjs(String(userId))?.[0];
    const currentObj = userSelectedObj ? objects()[String(userSelectedObj)] : null;

    if (!currentObj) return null;

    return <div className="px-4">
        {/* scene setting */}

        {/* object setting */}
        {
            currentObj &&
            <>
                <div className="flex flex-col gap-2">
                    {
                        objectsSettings[currentObj.type]?.map((group) => {
                            return <div className="flex flex-col gap-2" key={
                                group
                            }>
                                <div className="text-lg font-semibold">
                                    {group}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <GroupRenderer objectId={currentObj.id} name={group} onChange={(key, value) => {
                                        edit({
                                            id: currentObj.id,
                                            [key]: value
                                        })
                                    }} />
                                </div>
                            </div>
                        })
                    }
                </div>
            </>
        }
    </div>
}
export default Settings;