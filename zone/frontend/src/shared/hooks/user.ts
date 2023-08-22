import { useUserStore } from "../stores/user";
import usePocketbase from "./pb";

const useUser = () => {
    const { user, setUser, isLoading, setLoading } = useUserStore();

    const pb = usePocketbase();
    const getUser = () => {
        return new Promise((resolve) => {
            const isValid = pb.authStore.isValid;
            if (isValid && pb.authStore.model) {
                pb.admins.getOne(pb.authStore.model?.id).then((user) => {
                    setUser({
                        id: user.id,
                        name: user?.name ?? "",
                        email: user.email
                    });
                    setLoading(false);
                    resolve(true);

                }).finally(() => {
                    setLoading(false);
                })
            } else {
                setLoading(false);
            }
            return user;
        })
    }
    const setToken = (token: string) => {
        localStorage.setItem("token", token)
    }
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        pb.authStore.clear();
    }

    const isLogin = user !== null;
    return {
        isLoading,
        isLogin,
        user,
        getUser,
        setUser,
        logout,
        setLoading,
        setToken
    }
}
export default useUser;