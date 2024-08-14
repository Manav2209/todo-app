"use client"

import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { useRouter } from "next/navigation"
import { Input } from "@/components/Input";
import { BACKEND_URL } from "../config";
import { useState } from "react";
import axios from "axios";
import { Appbar } from "@/components/Appbar";


export default function () {
    
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();
    return <div>
        <Appbar/>
        <div className="flex justify-center">
            <div className="flex pt-8 max-w-4xl">
                <div className="flex-1 pt-20 px-4">
                   <div>
                    <img src ="https://todoist.b-cdn.net/assets/images/44245fc51c3e2ab05ee6d92c13e2e08a.png" className=""/>
                   </div>

                </div>
                <div className="flex-1 pt-6 pb-6 mt-12 px-4 border rounded">
                   
                    <Input onChange={e => {
                        setEmail(e.target.value)
                    }} label={"Email"} type="text" placeholder="Your Email"></Input>
                    <Input onChange={e => {
                        setPassword(e.target.value)
                    }} label={"Password"} type="password" placeholder="Password"></Input>

                     <div className="pt-4">
                        <PrimaryButton onClick={async () => {
                            const res = await axios.post(`${BACKEND_URL}/api/v1/user/signin`, {
                                username: email,
                                password,
                            });
                            localStorage.setItem("token", res.data.token);
                            router.push("/dashboard");
                        }} size="big">Login</PrimaryButton>
                    </div>
                </div>
            </div>
        </div>
        </div>
}