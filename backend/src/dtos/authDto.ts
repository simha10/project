import { z } from 'zod';

// Define the role enum values
export const UserRoleEnum = z.enum(['SUPERADMIN', 'ADMIN', 'SUPERVISOR', 'SURVEYOR']);
export type UserRole = z.infer<typeof UserRoleEnum>;

// Register DTO schema with strict role validation
export const RegisterDtoSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  role: UserRoleEnum,
  assignedWards: z.array(z.string()).optional()
});

// Login DTO schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["SUPERADMIN", "ADMIN", "SUPERVISOR", "SURVEYOR"], {
    errorMap: () => ({ message: "Invalid role selected" })
  })
});

// Export types
export type RegisterDto = z.infer<typeof RegisterDtoSchema>;
export type LoginDto = z.infer<typeof loginSchema>; 