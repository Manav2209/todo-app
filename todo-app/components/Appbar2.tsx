"use client"
import {  useRouter } from "next/navigation"

import { PrimaryButton } from "./buttons/PrimaryButton";


export const Appbar2 = () => {
    const router = useRouter();
    return <div className="flex border-b  justify-between p-4">
        
            <div className="flex flex-col justfy-center text-2xl font-extrabold">
            Todoist
            </div>
            <div className="flex">
                
                <div className=" pt-2 pr-4">
                <PrimaryButton onClick={() => {
                router.push("/")
                }}>
                Logout
                </PrimaryButton>            
                </div>
            </div>
        
    </div>
}