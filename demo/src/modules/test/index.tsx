import { RoomProvider, useIsConnected, useStorage } from "@collabjs/react";
import { useEffect, useRef } from "react";

type Shape = {
    x: number;
    y: number;
}
const Test = () => {
    const [shape, setShape] = useStorage<{
        shape: Shape
    }, Shape>(s => s.shape, {
        shape: {
            x: 0,
            y: 0
        }
    });
    // move shape with drag and drop
    const isDrag = useRef(false);


    const moveShape = (x: number, y: number) => {
        setShape(s => {
            s.shape.x += x;
            s.shape.y += y;
        })
    }
    useEffect(() => {
        const move = (e: MouseEvent) => {
            if (isDrag.current) {
                moveShape(e.movementX, e.movementY);
            }
        }
        const up = () => {
            isDrag.current = false;
        }
        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", up);
        return () => {
            document.removeEventListener("mousemove", move);
            document.removeEventListener("mouseup", up);
        }
    }, [])
    const connected=useIsConnected();


    const [forceRender, setForceRender] =useStorage<{
        count: number
    }, number>(s => s.count, {
        count: 0,
    });

    const fakeRender = () => {
        for (let i = forceRender; i < forceRender+1000; i++) {
            setForceRender(
                (s) => {
                    s.count += 1
                }
            );
        }
    }

    if(!connected){
        return <div className="fixed w-full h-full z-99 bg-black bg-opacity-25 flex justify-center items-center">
            Connecting...
        </div>
    }
    return <>
{forceRender} <br/  >
<button onClick={fakeRender}>
    make rerender 1000x
</button>
        {
            shape &&
            <div
            style={{
                position: "absolute",
                left: shape.x,
                top: shape.y,
                width: 100,
                height: 100,
                border: "1px solid cyan"
            }}
            onMouseDown={
                () => {
                    isDrag.current = true;
                }
            }
        />
        }

       
    </>
}
const TestWrapper = () => {
    return <RoomProvider id="idk"
        config={{
            url: "ws://localhost:3000",
        }}
    >
        <Test />
    </RoomProvider>
}
export default TestWrapper;