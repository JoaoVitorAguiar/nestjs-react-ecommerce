import { z } from "zod"

export const registerSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must have at least 6 characters")
})

export type RegisterFormData = z.infer<typeof registerSchema>
