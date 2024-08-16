import {z} from "zod";

export const TodoSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(500),
    status: z.enum(['pending', 'inprogress', 'completed']).default('pending'),
  });