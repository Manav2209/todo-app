'use client';

import { useRouter } from "next/navigation";
import { Input } from "@/components/Input";
import axios from "axios";
import { Appbar } from "@/components/Appbar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignIn() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);

      // Send email and password to your backend
      const res = await axios.post('/api/sign-in', {
        email: data.email,
        password: data.password,
      });

      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast({
          title: 'Login Failed',
          description: error.response.data.message || "Sign in failed.",
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: "An unexpected error occurred.",
          variant: 'destructive',
        });
      }
      console.error("Sign in error:", error);
    }
  };

  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div className="flex pt-8 max-w-4xl">
          <div className="flex-1 pt-20 px-4">
            <div>
              <img
                src="https://todoist.b-cdn.net/assets/images/44245fc51c3e2ab05ee6d92c13e2e08a.png"
                alt="Todoist"
              />
            </div>
          </div>
          <div className="flex-1 pt-6 pb-6 mt-12 px-4 border rounded">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Email"
                type="text"
                placeholder="Your Email"
                register={register}
                name="email"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}

              <Input
                label="Password"
                type="password"
                placeholder="Password"
                register={register}
                name="password"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}

              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  className="text-xl px-12 py-6 rounded-2xl cursor-pointer bg-red-500 text-white rounded-full text-center flex justify-center flex-col"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
