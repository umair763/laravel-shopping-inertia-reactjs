import { z } from "zod";

const orderSchema = z.object({
  shipping_address: z.string().min(10),
  payment_method: z.string().min(2),
});

export default orderSchema;
