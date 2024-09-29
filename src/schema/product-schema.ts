import { z, ZodFormattedError } from "zod";

export const ProductSchema = z.object({
  title: z.string(),
  description: z.string(),
  priceInPaise: z.number(),
  salePriceInPaise: z.number().optional(),
  attributes: z.record(z.array(z.string())),
  image: z.string(),
  otherImages: z.array(z.string()),
  vendorId: z.string(),
  category: z.string(),
  stock: z.number(),
  bestSeller: z.boolean(),
  bestSellerPriority: z.number(),
});

export type ProductSchemaType = z.infer<typeof ProductSchema>;
export type ProductSchemaFormattedError = ZodFormattedError<
  typeof ProductSchema
>;
