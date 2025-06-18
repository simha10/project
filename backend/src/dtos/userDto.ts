import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  role: z.enum(["SUPERADMIN", "ADMIN", "SUPERVISOR", "SURVEYOR"], {
    errorMap: () => ({ message: "Invalid role selected" })
  })
});

export type RegisterDto = z.infer<typeof registerSchema>; 