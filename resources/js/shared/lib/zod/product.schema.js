import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  sku: z.string().min(2),
  price: z.number().nonnegative(),
});

export default productSchema;
