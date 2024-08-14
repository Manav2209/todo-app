"use client"
import {useRouter}  from 'next/navigation'
import { PrimaryButton } from './buttons/PrimaryButton';
export const Hero = () => {
    const router = useRouter();
    return <div>
     
        <div className='flex justify-center'>
            <div className='text-5xl pt-16 font-bold text-center max-w-xl'>
            Organize your work and life, finally.
            </div>
        </div>
        <div className='flex justify-center pt-8'>
            <div className='text-xl font-light max-w-xl text-center'>
            Simplify life for both you and your team. The world’s #1 task manager and to-do list app.
            </div>
        </div>

        <div className='flex justify-center pt-6'>
            <div className='flex'>
                <PrimaryButton onClick={()=>{
                    router.push('/signup')
                }} size ="big" >Get started free</PrimaryButton>
            </div>
        </div>
        <div className='flex justify-center pt-8'>
            <div>
                <img src="https://res.cloudinary.com/imagist/image/fetch/q_auto,f_auto,c_scale,w_1536/https%3A%2F%2Ftodoist.com%2Fstatic%2Fhome-teams%2Fintro%2Fwide%2Fheaderui.en.png" className='max w-4xl'/>
            </div>
        </div>
    </div>
}