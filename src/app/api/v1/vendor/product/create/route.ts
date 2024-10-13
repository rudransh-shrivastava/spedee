import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { uploadFile } from "@/lib/s3";
import Product from "@/models/Product";

import { productFormDataSchema as productSchema } from "@/zod-schema/product-zod-schema";

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
  console.log("data recieved in backend", data);
  console.log("data after parsing in backend: ", product.data);
  const parsedProduct = product.data;
  // Parse the variants field
  let parsedVariants;
  try {
    const variantsString = data.get("variants") as string;
    if (variantsString) {
      parsedVariants = JSON.parse(variantsString);
      parsedVariants.map((variant: any) => {
        variant.attributes = JSON.parse(variant.attributes);
      });
    } else {
      parsedVariants = [];
    }
  } catch (error) {
    console.error("Failed to parse variants:", error);
    return Response.json({ message: "Invalid variants data" }, { status: 400 });
  }

  const imageFile = data.get("image") as File;
  const otherImagesFiles = data.getAll("otherImages") as File[];

  const uploadPromises = [];
  const newFileNames = [];

  if (imageFile) {
    const formattedFileName = `${new Date().toISOString()}-${imageFile.name}`;
    const key =
      "product-images/" +
      formattedFileName.replace(/:/g, "-").replace(/\./g, "-");
    uploadPromises.push(uploadFile(imageFile as File, key));
    newFileNames.push(key);
  }
  if (otherImagesFiles.length > 0) {
    otherImagesFiles.forEach((file) => {
      const formattedFileName = `${new Date().toISOString()}-${file.name}`;
      const key =
        "product-other-images/" +
        formattedFileName.replace(/:/g, "-").replace(/\./g, "-");
      uploadPromises.push(uploadFile(file as File, key));
      newFileNames.push(key);
    });
  }
  // TODO: Parse when frontend fix

  const attributes = JSON.parse(parsedProduct.attributes);

  // const attributes = parsedProduct.attributes;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  try {
    // upload files
    const uploadResponses = await Promise.all(uploadPromises);
    // Save product
    const newProduct = {
      name: parsedProduct.name,
      description: parsedProduct.description,
      priceInPaise: parsedProduct.priceInPaise,
      salePriceInPaise: parsedProduct.salePriceInPaise,
      attributes: attributes,
      image: newFileNames[0],
      otherImages: newFileNames.slice(1),
      vendorEmail: session.user.email,
      category: parsedProduct.category,
      stock: parsedProduct.stock,
      bestSeller: parsedProduct.bestSeller,
      bestSellerPriority: parsedProduct.bestSellerPriority,
      variants: parsedVariants,
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
