"use client"
import {  useRouter } from "next/navigation";
import { PrimaryButton } from "./buttons/PrimaryButton";


export const Appbar = () => {
    const router = useRouter();
    return <div className="flex border-b  justify-between p-4">
        
            <div className="flex flex-col justfy-center text-2xl font-extrabold">
                TodoList
            </div>
            <div className="flex">
                <div className="pr-4">
                <PrimaryButton onClick={() => { 
                    router.push("/signin")
                }}>Login</PrimaryButton>
                </div>
                <div className="pr-4">
                <PrimaryButton onClick={() => {
                router.push("/signup")
                }}>
                Signup
                </PrimaryButton>            
                </div>
            </div>
        
    </div>
}