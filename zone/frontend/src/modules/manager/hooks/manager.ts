import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import usePocketbase from "../../../shared/hooks/pb";
import { Room } from "../models/room";

const useRoomManager = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [roomsLoading, setRoomsLoading] = useState(true);
    const [activeRoom, setActiveRoom] = useState<string | null>(null);
    const [roomData, setRoomData] = useState<Room | null>(null);
    const [totalRooms, setTotalRooms] = useState(0);
    const [loadingRoom, setLoadingRoom] = useState(false);

    const [filters, setFilters] = useState({
        page: 1,
        query: ''
    })
    const [
        params,
        setParams
    ] = useSearchParams();
    const currentRoomId = params.get("id");

    const pb = usePocketbase();
    useEffect(() => {
        if (currentRoomId) {
            loadRoom(currentRoomId)
        } else {
            setActiveRoom(null);
        }
    }, [currentRoomId])

    const loadRooms = () => {
        setRoomsLoading(true);
        pb.collection("rooms").getList<Room>(filters.page, 10, {
            filter: filters?.query
        }).then(res => {
            console.log(res);
            setTotalRooms(res.totalItems)
            setRooms(res.items)
        }).finally(() => {
            setRoomsLoading(false);
        })
    }
    useEffect(() => {
        loadRooms();
    }, [filters.page])
    const loadRoom = (roomId: string) => {
        setActiveRoom(roomId);
        setLoadingRoom(true);

        pb.collection("rooms").getOne<Room>(roomId).then(res => {

            if (res) {
                setRoomData({
                    id: res.id,
                    name: res.name,
                    created: res.created,
                    updated: res.updated,
                })
            }
        }).finally(() => {
            setLoadingRoom(false)
        })
    }

    const selectRoom = (roomId: string) => {
        if (roomId != currentRoomId) {
            setParams({ id: roomId });
        }
    }
    return {
        rooms,
        roomsLoading,
        activeRoom,
        selectRoom,
        loadingRoom,
        roomData,
        totalRooms,
        filters
    }
}

export default useRoomManager;