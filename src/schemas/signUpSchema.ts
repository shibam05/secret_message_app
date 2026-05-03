import { z } from 'zod'

export const usernameValidation = z
    .string()
    .min(3, "username should be atleast 3 characters")
    .max(20, "username should not exceed 20 characters")
    .regex(/^[a-zA-Z-0-9_.]+$/, "username should not contain any special characters")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Invalid email id" }),
    password: z.string().min(6, { message: "password must be atleast 6 characters" })
})