import { z, ZodFormattedError } from "zod";
import { zfd } from "zod-form-data";

// export const productFormDataSchema = zfd.formData({
//   productId: zfd.text(),
//   name: zfd.text(),
//   description: zfd.text(),
//   priceInPaise: zfd.numeric(),
//   salePriceInPaise: zfd.numeric(),
//   attributes: zfd.text(),
//   image: zfd.file(),
//   otherImages: zfd.repeatableOfType(zfd.file()),
//   category: zfd.text(),
//   stock: zfd.numeric(),
//   bestSeller: zfd.text(),
//   bestSellerPriority: zfd.numeric(),
//   variants: zfd.repeatableOfType(zfd.text()),
// });

// export const newProductFormDataSchema = zfd.formData({
//   productId: z.string(),
//   name: z.string(),
//   description: z.string(),
//   attributes: z.record(z.array(z.string())),
//   category: z.string(),
//   bestSeller: z.string(),
//   bestSellerPriority: z.number(),
//   variants: z.array(
//     z.object({
//       attributes: z.record(z.string()),
//       stock: z.number(),
//       image: zfd.file(),
//       priceInPaise: z.number(),
//       salePriceInPaise: z.number().optional(),
//       otherImages: z.array(zfd.file()).optional(),
//     })
//   ),
// });

export const productFormDataSchema = zfd.formData({
  productId: zfd.text(z.string().min(1, { message: "Product ID is required" })),
  name: zfd.text(
    z
      .string()
      .min(2, { message: "Product name must be at least 2 characters" })
      .max(100, { message: "Product name cannot exceed 100 characters" })
  ),
  description: zfd.text(
    z
      .string()
      .min(10, { message: "Description must be at least 10 characters" })
      .max(1000, { message: "Description cannot exceed 1000 characters" })
  ),
  attributes: zfd.json(
    z
      .record(
        z
          .array(
            z.string().min(1, { message: "Attribute values must not be empty" })
          )
          .min(1, { message: "There should be at least one value" })
      )
      .refine((val) => Object.keys(val).length !== 0, {
        message: "There should be atleast one Attribute",
      })
  ),
  category: zfd.text(z.string().min(1, { message: "Category is required" })),
  bestSeller: zfd.text(
    z.enum(["true", "false"], {
      message: "Best seller must be either 'true' or 'false'",
    })
  ),
  bestSellerPriority: zfd.numeric(
    z
      .number()
      .min(1, { message: "Priority must be at least 1" })
      .max(100, { message: "Priority cannot exceed 100" })
  ),
  variants: zfd.json(
    z
      .array(
        z.object({
          attributes: zfd.json(
            z
              .record(z.string())
              .refine((val) => Object.keys(val).length !== 0, {
                message: "There should be atleast one Attribute",
              })
              .refine((val) => Object.values(val).every((v) => v.length > 0), {
                message: "All variant attribute must have a value",
              })
          ),
          stock: zfd.numeric(
            z
              .number()
              .int()
              .positive({ message: "Stock must be a positive number" })
          ),
          image: zfd.file(
            z.instanceof(File, {
              message: "Image file is required for each variant",
            })
          ),
          priceInPaise: zfd.numeric(
            z.number().min(1, { message: "Price must be at least 1 paise" })
          ),
          salePriceInPaise: zfd.numeric(
            z
              .number()
              .optional()
              .refine((val) => val === undefined || val > 0, {
                message: "Sale price must be greater than 0",
              })
          ),
          otherImages: z.array(zfd.file(z.instanceof(File))).optional(),
        })
      )
      .nonempty({ message: "At least one variant is required" })
  ),
});

type productFormDataSchemaType = z.infer<typeof productFormDataSchema>;
export type productFormDataSchemaErrorType =
  ZodFormattedError<productFormDataSchemaType>;
