import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { uploadFile } from "@/lib/s3";
import Product from "@/models/Product";

import { newProductFormDataSchema as productSchema } from "@/zod-schema/product-zod-schema";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "vendor") {
    return Response.json({ message: "Forbidden" }, { status: 403 });
  }
  await connectDB();

  const data = await req.formData();
  const product = productSchema.safeParse(data);
  if (!product.success) {
    return Response.json({ message: "Invalid data" }, { status: 400 });
  }

  const parsedProduct = product.data;

  // const imageFile = data.get("image") as File;
  // const otherImagesFiles = data.getAll("otherImages") as File[];

  const uploadPromises = [];
  const newFileNames = [];

  // if (imageFile) {
  //   const formattedFileName = `${new Date().toISOString()}-${imageFile.name}`;
  //   const key =
  //     "product-images/" +
  //     formattedFileName.replace(/:/g, "-").replace(/\./g, "-");
  //   uploadPromises.push(uploadFile(imageFile as File, key));
  //   newFileNames.push(key);
  // }
  // if (otherImagesFiles.length > 0) {
  //   otherImagesFiles.forEach((file) => {
  //     const formattedFileName = `${new Date().toISOString()}-${file.name}`;
  //     const key =
  //       "product-other-images/" +
  //       formattedFileName.replace(/:/g, "-").replace(/\./g, "-");
  //     uploadPromises.push(uploadFile(file as File, key));
  //     newFileNames.push(key);
  //   });
  // }
  // TODO: Parse when frontend fix

  // const attributes = parsedProduct.attributes;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  try {
    // upload files
    // const uploadResponses = await Promise.all(uploadPromises);
    // Save product
    const newProduct = {
      name: parsedProduct.name,
      description: parsedProduct.description,
      attributes: attributes,
      vendorEmail: session.user.email,
      category: parsedProduct.category,
      bestSeller: parsedProduct.bestSeller,
      bestSellerPriority: parsedProduct.bestSellerPriority,
      variants,
    };
    await Product.create(newProduct);

    return Response.json({
      message: "Product created successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Error uploading images" },
      { status: 500 }
    );
  }
}
// TODO: Store variant images
