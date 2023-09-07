import { useIsConnected, useSelf } from "@collabjs/react";
import { User as IUser } from "../../../../shared/models/user";
import clsx from "clsx";
import useUsers from "../../../../shared/hooks/users";
import { Tooltip } from "@nextui-org/react";
import { useEffect } from "react";

// @ts-ignore
import dockerName from "docker-names";
import Cursor from "../cursor";

const colors = ["#FE5E5E", "#885EFE", "#FE5EE4", "#5EB1FE", "#4CD359", "#FF985F"];
const User = ({ bordered, user }: {
    user: IUser,
    bordered?: boolean,
}) => {
    return <Tooltip content={user?.name ?? "Unknown"} placement="top">
        <div className="w-[40px] h-[40px] flex items-center justify-center rounded-full " style={{
            background: bordered ? user?.color ?? "#FE5E5E" : "transparent"
        }}>
            <div className={clsx("w-[85%] h-[85%] uppercase rounded-full  flex items-center justify-center border-[2px] border-[#202020] ")}
                style={{
                    background: user?.color ?? "#FE5E5E"
                }}
            >
                {user?.name?.[0] ?? "A"}
            </div>
        </div>
    </Tooltip>
}
type Info = {
    id: number
    name: string
    color: string
}
export const Users = () => {
    const self = useSelf<IUser>();
    const { users } = useUsers();
    const isConnected = useIsConnected();

    // first time
    useEffect(() => {
        let info: Info | null = null;
        const infoStr = localStorage.getItem('info');
        if (infoStr) {
            info = JSON.parse(infoStr);
        }
        if (isConnected && !info) {
            const data = {
                id: Date.now(),
                name: dockerName.getRandomName(),
                color: colors[Math.floor(Math.random() * colors.length)]
            };
            localStorage.setItem("info", JSON.stringify(data));
            info = data;

            self.update(draft => {
                if (info) {
                    draft.color = info.color;
                    draft.name = info.name;
                    draft.userId = `${info.id}`;
                }
            });
        }

        if (isConnected && info) {
            self.update(draft => {
                if (info) {
                    draft.color = info.color;
                    draft.name = info.name;
                    draft.userId = `${info.id}`;
                }
            });
        }
    }, [isConnected])

    useEffect(() => {
        const canvas = document.querySelector(".canvas") as HTMLDivElement;
        const onMove = (e: MouseEvent) => {
            if (!isConnected) return

            // Get the mouse position relative to the container
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            self.update(draft => {
                draft.position = { x: mouseX, y: mouseY };
            });
        }
        canvas.addEventListener("mousemove", onMove);
        return () => {
            canvas.removeEventListener("mousemove", onMove);
        }
    }, [isConnected])
    return <div className="flex gap-2">
        <User user={self.data} bordered />
        {
            users.map(user => {
                if (!user.userId) return
                return <div key={user.uid}>
                    <User user={user} />
                </div>
            })
        }
    </div>
};
export const UserCursors = () => {
    const { users } = useUsers();

    return <>
        {
            users.map(user => {
                if (!user.position) return
                return user?.position && <Cursor color={user.color}
                    x={user.position.x}
                    y={user.position.y}
                />;
            })
        }
    </>
}
export default Users;