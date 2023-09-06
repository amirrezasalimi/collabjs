import { NextUIProvider } from "@nextui-org/react";
import Home from "../modules/home";
// import TestWrapper from "../modules/test";

const Base = () => {
    return <>
        <NextUIProvider>
            <Home/>
        </NextUIProvider>
    </>
}
export default Base;