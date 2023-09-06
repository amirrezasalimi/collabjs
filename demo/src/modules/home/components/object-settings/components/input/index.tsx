import { Component } from "../../types";

interface InputComponentProps extends Component {
    type: "text" | "number"
}
// components
export const InputComponent = ({ value, onChange, type }: InputComponentProps) => {
    return <div>
        <input className="outline-none border-1 border-white rounded-md bg-transparent px-2"
            type={type} value={value} onChange={(e) => {
                if (type === "number") {
                    onChange?.(Number(e.target.value));
                } else {
                    onChange?.(e.target.value);
                }
            }} />
    </div>
}