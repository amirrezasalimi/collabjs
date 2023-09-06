import clsx from "clsx";
import { ReactNode } from "react";

interface PanelProps {
    children: ReactNode
    className?: string
}
export const Panel = ({ children, className }: PanelProps) => {

    return <div className={clsx(className, "rounded-xl bg-[#202020] text-white select-none overflow-hidden")}>
        {children}
    </div>;
}