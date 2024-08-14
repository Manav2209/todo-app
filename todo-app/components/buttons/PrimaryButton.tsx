"use client"

import { ReactNode } from "react"


export const PrimaryButton = ({children , onClick , size ="small"}:{
    children :ReactNode,
    onClick : () =>void,
    size ?: "big"|"small"
}) =>{
    return <div onClick={onClick} className={`${size === "small" ? "text-sm" : "text-xl"} ${size === "small" ? "px-8 py-2 rounded-full" : "px-12 py-6 rounded-2xl"} cursor-pointer bg-red-500 text-white rounded-full text-center flex justify-center flex-col`}>
    {children}
</div>

}