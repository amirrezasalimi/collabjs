import { useState } from "react";
import useUser from "../../../shared/hooks/user";
import usePocketbase from "../../../shared/hooks/pb";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const pb = usePocketbase();
    const user = useUser();

    const navigate = useNavigate();
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        pb.admins.authWithPassword(email, password).then(async (res) => {
            if (res.token) {
                user.setToken(res.token);
                await user.getUser();
                navigate("/manager")
            }
        }).catch((err) => {
            console.log(err);
            toast(err.message)
        })
            .finally(() => {
                setIsLoading(false);
            })

    }
    return {
        login,
        isLoading
    }
}
export default useAuth;