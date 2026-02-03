import { z } from "zod";
import { emailSchema } from "../../lib/zod/zod-schemas";

const loginBody = z.object({
    username: z.string().nonempty("Username is required"),
    password: z.string().nonempty("Password is required"),
}).strict();

const registerBody = z.object({
    username: z.string().min(3, "Username must be at least 3 characters").nonempty(),
    password: z.string().min(6, "Password must be at least 6 characters").nonempty(),
    email: emailSchema,
    fullName: z.string().nonempty("Full name is required")
}).strict();

export type AdminLogin = z.infer<typeof loginBody>
export type AdminRegister = z.infer<typeof registerBody>

export const AdminAuthValidators = {
    login: loginBody,
    register: registerBody
}
