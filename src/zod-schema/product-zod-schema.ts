import { z } from "zod";
import { zfd } from "zod-form-data";

export const productFormDataSchema = zfd.formData({
  productId: zfd.text(),
  name: zfd.text(),
  description: zfd.text(),
  priceInPaise: zfd.numeric(),
  salePriceInPaise: zfd.numeric(),
  attributes: zfd.text(),
  image: zfd.file(),
  otherImages: zfd.repeatableOfType(zfd.file()),
  category: zfd.text(),
  stock: zfd.numeric(),
  bestSeller: zfd.text(),
  bestSellerPriority: zfd.numeric(),
  variants: zfd.repeatableOfType(zfd.text()),
});

export const newProductFormDataSchema = zfd.formData({
  productId: z.string(),
  name: z.string(),
  description: z.string(),
  attributes: z.record(z.array(z.string())),
  category: z.string(),
  bestSeller: z.string(),
  bestSellerPriority: z.number(),
  variants: z.array(
    z.object({
      attributes: z.record(z.string()),
      stock: z.number(),
      image: zfd.file(),
      priceInPaise: z.number(),
      salePriceInPaise: z.number().optional(),
      otherImages: z.array(zfd.file()).optional(),
    })
  ),
});
