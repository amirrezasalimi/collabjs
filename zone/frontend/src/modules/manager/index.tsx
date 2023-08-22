import clsx from "clsx";
import useRoomManager from "./hooks/manager";
import { CircularProgress, Tooltip } from "@nextui-org/react";
import { CgDatabase, CgTime } from "react-icons/cg";
import ReactJson from "react-json-view";
import { Helmet } from "react-helmet";
import { RoomProvider, useClients, useIsConnected, useIsSynced, useSelf, useStorage } from "@collabjs/react";
import { Room } from "./models/room";
import { API_HOST } from "../../shared/constants/api";

import TimeAgo from 'javascript-time-ago'
import ReactTimeAgo from 'react-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import { formatBytes } from "../../shared/utils/size";
import { useEffect } from "react";
TimeAgo.addDefaultLocale(en)

function calculateJSONObjectSize(object: object) {
    const jsonString = JSON.stringify(object);
    const bytes = new TextEncoder().encode(jsonString).length;
    return bytes;
}
const RoomView = ({ name, created }: Room) => {
    const connected = useIsConnected();
    const isSynced = useIsSynced();
    const clients = useClients();
    const self = useSelf();


    useEffect(() => {
        console.log("mount RoomView");
        return () => {
            console.log("unmount RoomView");
        }
    }, [])

    type state = {
        count: number;
    }
    const [_data] = useStorage<state, state>(s => s);

    const storage = JSON.parse(JSON.stringify(_data));
    const size = formatBytes(calculateJSONObjectSize(storage));
    return <>
        <div className="text-cyan-400 flex items-center">
            <span className="text-2xl">
                Room / <b>{name}</b> {self.data.uid}
            </span>
            {
                connected && isSynced &&
                <div className="text-red-500 ml-2 text-md font-bold">
                    LIVE
                </div>
            }
        </div>
        {
            !connected &&
            <div className="flex items-center justify-center h-full">
                <CircularProgress />
            </div>
        }
        {
            connected &&
            <>
                {/* info & clients */}
                <div className="mt-2 flex justify-between items-center">
                    <div className="flex gap-2">
                        <div className="flex pr-2 gap-2 text-white items-center border-r">
                            <CgTime />
                            <span>
                                <ReactTimeAgo date={new Date(created)} locale="en-US" />
                            </span>
                        </div>
                        <div className="flex gap-2 text-white items-center">
                            <CgDatabase />
                            <span>
                                {size}
                            </span>
                        </div>
                    </div>
                    {/* clients */}
                    <div className="flex">
                        {
                            clients.clients.map((item) => {
                                const fromColor = item?.color ?? "cyan"
                                const toColor = item?.color ?? "#2F2F2F"
                                return <Tooltip content={`client ${item.uid}`} key={item.uid}>
                                    <div
                                        className={`w-8 h-8 ml-[-8px] rounded-full border-1 border-white`}
                                        style={{
                                            background: `linear-gradient(to bottom right, ${fromColor}, ${toColor})`
                                        }}
                                    />
                                </Tooltip>

                            })
                        }
                    </div>
                </div>

                <div className="text-lg mt-4 text-white">
                    Storage
                </div>
                <div className="mt-2 h-[100%] pb-2 overflow-auto">
                    <style dangerouslySetInnerHTML={{
                        __html: `
                            .react-json-view{
                                background: transparent !important;
                            }
                            `
                    }} />

                    {/* storage */}
                    <ReactJson
                        displayObjectSize
                        displayDataTypes
                        src={storage} theme={"ashes"} style={{
                            background: "trasparent"
                        }} />
                </div>
            </>
        }

    </>
}
const Manager = () => {
    const manager = useRoomManager();

    return <>
        <Helmet>
            <title>
                Manager
            </title>
        </Helmet>
        <div className="w-full h-full flex overflow-hidden gap-10">
            {/* left */}
            <div className="w-[250px]">
                <div className="text-2xl text-white">
                    {
                        !manager.roomsLoading &&
                        <>
                            Rooms ({manager.totalRooms})
                        </>
                    }
                </div>
                {/* rooms */}
                <div className=" ">
                    {/* filters & search*/}
                    <div>
                        <div className="w-full mt-6 px-2 flex gap-4">
                            <span className="text-white font-semibold cursor-pointer">
                                All
                            </span>
                            <span className="text-white cursor-pointer">
                                Active
                            </span>
                            <span className="text-white cursor-pointer">
                                Saved
                            </span>
                        </div>
                        <div className="mt-3 h-[1px] w-full bg-[#DBDBDB]" />
                    </div>
                </div>

                {/* items */}
                <div className="gap-3 flex flex-col  scroll-m-2 h-[80%] overflow-scroll mt-4">
                    {
                        (!manager.roomsLoading || manager.filters.page > 1) &&
                        manager.rooms.map((item, index) => {
                            return <div key={index}
                                onClick={() => manager.selectRoom(item.id)}
                                className={clsx("w-full transition-all border-2 flex justify-center py-2 text-md text-white rounded-md cursor-pointer",
                                    manager.activeRoom === item.id ? "bg-[#2F2F2F] border-2 border-cyan-400" : "hover:bg-[#2F2F2F]"
                                )}>
                                {item.name}
                            </div>
                        })
                    }
                </div>
            </div>

            {/* right */}
            <div className="w-[calc(100%-250px)]">
                {/* choose a room */}
                {
                    (manager.activeRoom === null || manager.loadingRoom) &&
                    <div className="w-full h-full flex justify-center items-center">
                        {
                            manager.activeRoom === null &&
                            <div className="text-2xl text-white">
                                Choose a room 🪄
                            </div>
                        }
                        {
                            manager.loadingRoom &&
                            <div className="text-2xl text-white">
                                <CircularProgress />
                            </div>
                        }

                    </div>
                }

                {/* room */}
                {
                    (manager.activeRoom !== null && !manager.loadingRoom && manager.roomData?.name) &&
                    <div className="w-full h-full flex flex-col">
                        <RoomProvider config={{
                            url: API_HOST
                        }} id={manager.roomData.name}>
                            <RoomView {...manager.roomData} />
                        </RoomProvider>
                    </div>
                }
            </div>
        </div>
    </>
}

export default Manager;