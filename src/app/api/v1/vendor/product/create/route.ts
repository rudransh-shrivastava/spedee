import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { uploadFile } from "@/lib/s3";
import Product, { VariantType } from "@/models/Product";

import { productFormDataSchema as productSchema } from "@/zod-schema/product-zod-schema";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({
      message: "Unauthorized",
      status: 401,
      error: true,
      success: false,
    });
  }
  if (session.user.role !== "vendor") {
    return Response.json({
      message: "Forbidden",
      status: 403,
      error: true,
      success: false,
    });
  }
  await connectDB();

  const data = await req.formData();
  const product = productSchema.safeParse(data);
  if (!product.success) {
    return Response.json({
      message: "Invalid data",
      status: 400,
      success: false,
      error: product.error,
    });
  }
  const uploadPromises = [];
  const parsedProduct = product.data;

  const productVariants: VariantType[] = [];
  for (const variant of parsedProduct.variants) {
    const variantImage = data.get(
      `variant-${variant.attributes}-image`
    ) as File;
    const variantOtherImages = data.getAll(
      `variant-${variant.attributes}-otherImages`
    ) as File[];
    const newFileNames: string[] = [];
    if (variantImage) {
      const formattedFileName = `${new Date().toISOString()}-${variantImage.name}`;
      const key =
        "product-variant-images/" +
        formattedFileName.replace(/:/g, "-").replace(/\./g, "-");
      uploadPromises.push(uploadFile(variantImage as File, key));
      newFileNames.push(key);
    }
    if (variantOtherImages.length > 0) {
      variantOtherImages.forEach((file) => {
        const formattedFileName = `${new Date().toISOString()}-${file.name}`;
        const key =
          "product-variant-other-images/" +
          formattedFileName.replace(/:/g, "-").replace(/\./g, "-");
        uploadPromises.push(uploadFile(file as File, key));
        newFileNames.push(key);
      });
    }
    productVariants.push({
      attributes: variant.attributes,
      stock: variant.stock,
      image: newFileNames[0],
      priceInPaise: variant.priceInPaise,
      salePriceInPaise: variant.salePriceInPaise ?? variant.priceInPaise,
      otherImages: newFileNames.slice(1),
    });
  }

  const newProduct = {
    name: parsedProduct.name,
    description: parsedProduct.description,
    attributes: parsedProduct.attributes,
    vendorEmail: session.user.email,
    category: parsedProduct.category,
    bestSeller: parsedProduct.bestSeller,
    bestSellerPriority: parsedProduct.bestSellerPriority,
    variants: productVariants,
  };

  try {
    // upload files
    await Promise.all(uploadPromises);
    // Save product
    await Product.create(newProduct);

    return Response.json({
      message: "Product created successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return Response.json({
      message: "Error uploading images",
      status: 500,
      error: true,
      success: false,
    });
  }
}
