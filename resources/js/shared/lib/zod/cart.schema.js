import { z } from "zod";

const cartSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().min(1),
});

export default cartSchema;
