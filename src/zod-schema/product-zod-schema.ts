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
