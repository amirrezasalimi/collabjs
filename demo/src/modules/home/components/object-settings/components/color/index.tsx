import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react"
import { Component } from "../../types"
import { HexAlphaColorPicker } from "react-colorful"

interface ColorComponentProps extends Component {

}
export const ColorComponent = ({ value, onChange }: ColorComponentProps) => {
    return <>
        <Popover placement="left">
            <PopoverTrigger>
                <div className="w-[32px] h-[32px] rounded-md" style={{
                    background: value ?? "#fff"
                }} />
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <HexAlphaColorPicker color={value} onChange={(v) => {
                    onChange?.(v);
                }} />
            </PopoverContent>
        </Popover>
    </>
}