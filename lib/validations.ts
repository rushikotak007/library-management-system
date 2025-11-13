import { z } from "zod";

export const SignUpSchema = z.object({
    fullName: z.string().min(3, "Full name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    universityId: z.coerce.number().min(1, "University ID must be a positive number"),
    universityCard : z.string().nonempty("University card is required"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const SignInSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});