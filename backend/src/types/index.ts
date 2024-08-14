import {z} from "zod";

export const TodoSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(500),
    status: z.enum(['pending', 'inprogress', 'completed']).default('pending'),
  });

export const SignupSchema = z.object({
    username: z.string().min(5),
    password: z.string().min(6),
    name: z.string().min(3)
});

export const SigninSchema = z.object({
    username: z.string(),
    password: z.string()
});
