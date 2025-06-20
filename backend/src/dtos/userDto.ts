import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  mobileNumber: z.string().min(10, "Mobile number is required"),
});

export type RegisterDto = z.infer<typeof registerSchema>; 