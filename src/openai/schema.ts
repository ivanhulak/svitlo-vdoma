import { z } from 'zod';

export const ProductResponseSchema = z.object({
  product_ids: z.array(z.string()),
});
