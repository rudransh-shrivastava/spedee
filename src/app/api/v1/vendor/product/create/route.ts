import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { zfd } from "zod-form-data";
import { uploadFile } from "@/lib/s3";
import Product from "@/models/Product";

const productSchema = zfd.formData({
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
  variants: zfd.repeatableOfType(
    zfd.formData({
      attributes: zfd.text(),
      stock: zfd.numeric(),
      image: zfd.text().nullable(),
    })
  ),
});

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
    console.log(product.error);
    return Response.json({ message: "Invalid data" }, { status: 400 });
  }
  const parsedProduct = product.data;

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
  // Parse the attributes and variants JSON strings
  const attributes = JSON.parse(parsedProduct.attributes);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const variants = parsedProduct.variants.map((variant: any) => ({
    ...variant,
    attributes: JSON.parse(variant.attributes),
  }));
  try {
    // upload files
    const uploadResponses = await Promise.all(uploadPromises);
    console.log(uploadResponses);
    // Save product
    const newProduct = new Product({
      name: parsedProduct.name,
      description: parsedProduct.description,
      priceInPaise: parsedProduct.priceInPaise,
      salePriceInPaise: parsedProduct.salePriceInPaise,
      attributes: attributes,
      image: parsedProduct.image,
      otherImages: parsedProduct.otherImages,
      category: parsedProduct.category,
      stock: parsedProduct.stock,
      bestSeller: parsedProduct.bestSeller,
      bestSellerPriority: parsedProduct.bestSellerPriority,
      variants: variants,
    });
    await newProduct.save();

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
