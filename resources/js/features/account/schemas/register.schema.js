import { z } from "zod";
const registerSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8), password_confirmation: z.string().min(8) });
export default registerSchema;
