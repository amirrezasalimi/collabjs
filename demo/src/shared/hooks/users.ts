import { useClients } from "@collabjs/react";
import { User } from "../models/user";


const useUsers = () => {
    const { clients } = useClients();

    return {
        users: clients as User[]

    }
}
export default useUsers;