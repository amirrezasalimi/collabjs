import { Helmet } from "react-helmet";
import useAuth from "./hooks/auth";
import { Button, Input } from "@nextui-org/react";
import { useState } from "react";

const Auth = () => {
    const auth = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const login = () => {
        auth.login(
            email,
            password
        )
    }
    return (
        <>
            <Helmet>
                <title>
                    Auth
                </title>
            </Helmet>
            <div className="flex flex-col items-center justify-center h-full gap-8">
                <div className="text-white text-3xl">
                    Auth / Login
                </div>
                <div className="flex flex-col gap-2 text-white w-[250px]">
                    <Input name="email" value={email}
                        onChange={e => {
                            setEmail(e.target.value)
                        }} className="w-full" placeholder="Email" variant="faded" />
                    <Input name="password" type="password" onChange={e => {
                        setPassword(e.target.value)
                    }}
                        value={password} className="w-full" placeholder="Password" variant="faded" />
                    <Button className="mt-2" disabled={auth.isLoading} onClick={login} color="primary">
                        Login
                    </Button>
                </div>
            </div>
        </>
    )
}
export default Auth;