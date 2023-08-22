import { Button, CircularProgress } from "@nextui-org/react";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useUser from "../../hooks/user";

const ManagerLayout = () => {

    const route = useLocation();
    const user = useUser();

    useEffect(() => {
        user.getUser();
    }, [route.pathname])


    const isLoaded = !user.isLoading;

    const navigate = useNavigate();
    const loc = useLocation();
    const isAuthPage = loc.pathname === '/auth';
    useEffect(() => {
        console.log("path", loc.pathname);

        if (!isAuthPage) {
            if (isLoaded && !user.isLogin) {
                navigate('/auth')
            }
        } else {
            user.setLoading(false);
        }

    }, [loc.pathname, user.isLoading, user.isLogin])

    return (
        <div className="dark w-screen h-screen bg-[#1C1C1C] py-[5%] overflow-hidden flex justify-center items-center">

            <div className="container m-auto h-[90%] relative">
                {
                    !isAuthPage &&
                    <div className="flex justify-between absolute right-0 top-[-48px]">
                        <div />
                        <div>
                            <Button onPress={user.logout} color="danger" variant="light" className="mb-2">
                                logout
                            </Button>
                        </div>
                    </div>
                }
                <div className="rounded-xl h-full bg-[#242424] px-12 pt-6">
                    {
                        ((isLoaded && user.isLogin) || isAuthPage) ?
                            <Outlet /> :
                            <div className="w-full h-full flex justify-center items-center">
                                <CircularProgress />
                            </div>

                    }
                </div>
                <div className="flex justify-between absolute right-0 bottom-[-48px]">
                        <div />
                        <div>
                            <Button onPress={user.logout} color="danger" variant="light" className="mb-2">
                                logout
                            </Button>
                        </div>
                    </div>
            </div>
        </div>
    )
}
export default ManagerLayout;