import { z } from "zod";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export default authSchema;
