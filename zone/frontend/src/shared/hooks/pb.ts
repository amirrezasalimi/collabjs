import { useLayoutEffect, useRef } from "react"
import { POCKETBASE_HOST } from "../constants/api"
import Pocketbase from "pocketbase"
import useLocalStorage from "use-local-storage";
const usePocketbase = () => {
    const pb = useRef(
        new Pocketbase(POCKETBASE_HOST)
    );
    const [token] = useLocalStorage("token", null);
    useLayoutEffect(() => {
        if (token) {
            pb.current.authStore.save(token, null);
        }
    }, [token])
    return pb.current;
}
export default usePocketbase;