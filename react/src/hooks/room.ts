import {  roomContext } from "../context/room";
import { useStore } from "zustand";

const useRoom = () => {
    const store = roomContext();
    const room = useStore(store.roomStore);
    return room;
}
export default useRoom;