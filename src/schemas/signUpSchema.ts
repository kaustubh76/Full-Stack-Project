import {z} from 'zod'

export const usernameValidation = z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(30, "Username must be at most 30 characters long")
    .regex(/^[a-zA-Z0-9_]*$/, "Username can only contain letters, numbers, and underscores")

    // Here we are using z.object because we have to check multiple fields instead we can check
    // each field separately like above
export const sigUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message: 'Invalid email address'}),
    password: z.string().min(6, {message: "password must be atleast 6 characters"})
})