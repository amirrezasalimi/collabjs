import { RoomProvider, useIsConnected } from "@collabjs/react";
import { CircularProgress } from "@nextui-org/react";
import { Panel } from "./components/panel";
import { Divider } from "./divider";
import Users from "./components/users";
import useObjects, { useObjectsStatic } from "../../shared/hooks/objects";
import Settings from "./components/object-settings";
import useSelect from "../../shared/hooks/selection";
import clsx from "clsx";
import { getUserId } from "../../shared/utils/user";
import { CanvasContent } from "./components/canvas-content";


const ObjectsList = () => {
    const { objects } = useObjects();
    const objectsArray = Object.keys(objects);
    const selection = useSelect();
    const selfId = getUserId();
    const isSelected = (id: string) => {
        return selection.isObjSelected(id) && selection.getObjSelectedUsers(id).includes(String(selfId))
    }


    const objStatic = useObjectsStatic();

    return <>
        {
            objectsArray.map((id) => {
                const obj = objects[id];
                return <div
                    onClick={() => {
                        selection.selectObj(obj.id, getUserId());
                    }}
                    key={obj.id} className={
                        clsx(
                            "relative first-letter:pl-5 before:absolute before:w-[10px] before:h-[1px] before:top-[calc(50%-1px/2)] before:left-0 before:bg-white",
                            isSelected(obj.id) && "bg-[#3A3A3A] bg-opacity-50"
                        )
                    }>
                    {objStatic.objects()?.[obj.id]?.name}
                </div>
            })
        }
    </>
}

const Room = () => {
    const isConnected = useIsConnected();

    if (!isConnected) {
        return <div className="fixed w-full h-full z-99 bg-black bg-opacity-25 flex justify-center items-center">
            <CircularProgress color="default" />
        </div>
    }
    return <>
        {/* objects panel */}
        <Panel className="fixed left-2  top-2 w-[220px] h-[90vh]">
            <div className="font-semibold m-4">
                Objects
            </div>
            <Divider />
            <div className="w-full h-fit m-4 border-l-1 border-white relative">
                <ObjectsList />
            </div>
        </Panel>

        {/* top menu */}
        <Panel className="fixed top-2 left-[calc(50%-(150px/2))] w-[150px] p-2 px-4 h-[56px] flex items-center gap-3">
            <div className="hover:opacity-70 transition-all"
                draggable
                onDragStart={
                    (e) => {
                        e.dataTransfer.setData("text", "rectangle");
                    }
                }
            >
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="32" height="32" rx="7" stroke="white" strokeWidth="2" />
                </svg>
            </div>
            <div className="hover:opacity-70 transition-all"
                draggable
                onDragStart={
                    (e) => {
                        e.dataTransfer.setData("text", "circle");
                    }
                }
            >
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1" y="1" width="32" height="32" rx="16" stroke="white" strokeWidth="2" />
                </svg>
            </div>

            <div className="hover:opacity-70 transition-all"
                draggable
                onDragStart={
                    (e) => {
                        e.dataTransfer.setData("text", "text");
                    }
                }
            >
                <svg width="29" height="31" viewBox="0 0 29 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 2H29" stroke="white" strokeWidth="2.95316" />
                    <path d="M13.9487 1.67053L13.9487 30.3783" stroke="white" strokeWidth="2.95316" />
                </svg>
            </div>

            {/* <div className="w-[10px] h-[80%] mx-1 bg-[#3A3A3A] rounded-full" /> */}
        </Panel>

        {/* objects */}
        <CanvasContent />

        {/* setting panel */}
        <Panel className="fixed flex flex-col right-2 top-2 w-[220px] h-[90vh] pb-4">
            <div className="p-3">
                <Users />
            </div>
            <Divider />
            <div className="mt-2 h-full overflow-scroll">
                <Settings />
            </div>
        </Panel>

    </>
}

const Home = () => {
    return <RoomProvider id="main2" config={{
        url: "ws://localhost:3000",
    }}
        storage={{
            objects: {

            },
            object_data: {

            },
            selected: {

            }
        }}
    >
        <Room />
    </RoomProvider>
}
export default Home;