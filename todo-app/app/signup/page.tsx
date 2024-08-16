'use client';

import { useRouter } from "next/navigation";
import { Input } from "@/components/Input";
import axios from "axios";
import { Appbar } from "@/components/Appbar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  passwordConfirm: z.string().min(6, "Password confirmation must be at least 6 characters"),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwords do not match",
  path: ["passwordConfirm"],
});

export default function SignUp() {
  const router = useRouter();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      // Sign up with Firebase
      await createUserWithEmailAndPassword(auth, data.email, data.password);

      // Send name, email, and password to your backend
      const res = await axios.post('/api/sign-up', {
        name: data.name,
        email: data.email,
        password: data.password, // Make sure your backend handles plain passwords securely
      });

      if (res.data.success) {
        router.push("/signin");
      } else {
        toast({
          title: 'Registration Failed',
          description: res.data.message || "Sign up failed.",
          variant: 'destructive',
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast({
          title: 'Registration Failed',
          description: error.response.data.message || "Sign up failed.",
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: "An unexpected error occurred.",
          variant: 'destructive',
        });
      }
      console.error("Sign up error:", error);
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
                label="Name"
                placeholder="Your name"
                register={register}
                name="name"
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}

              <Input
                label="Email"
                placeholder="Your Email"
                register={register}
                name="email"
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}

              <Input
                label="Password"
                placeholder="Password"
                type="password"
                register={register}
                name="password"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}

              <Input
                label="Confirm Password"
                placeholder="Confirm Password"
                type="password"
                register={register}
                name="passwordConfirm"
              />
              {errors.passwordConfirm && (
                <p className="text-red-500">{errors.passwordConfirm.message}</p>
              )}

              <div className="pt-4 justify-center">
                <button
                  type="submit"
                  className="text-xl px-12 py-6 rounded-2xl cursor-pointer bg-red-500 text-white rounded-full text-center flex justify-center flex-col"
                >
                  Register the User
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
