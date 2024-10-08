import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { zfd } from "zod-form-data";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

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
  console.log(data);
  const product = productSchema.safeParse(data);
  if (!product.success) {
    console.log(product.error);
    return Response.json({ message: "Invalid data" }, { status: 400 });
  }
  const client = new S3Client({ region: process.env.AWS_REGION });

  const imageFile = data.get("image") as File;
  const otherImagesFiles = data.getAll("otherImages") as File[];

  const uploadFile = async (file: File, key: string) => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    };
    const command = new PutObjectCommand(uploadParams);
    return client.send(command);
  };

  const uploadPromises = [];
  if (imageFile) {
    const formattedFileName = `${new Date().toISOString()}-${imageFile.name}`;
    const key =
      "product-images/" +
      formattedFileName.replace(/:/g, "-").replace(/\./g, "-");
    uploadPromises.push(uploadFile(imageFile as File, key));
  }
  if (otherImagesFiles.length > 0) {
    otherImagesFiles.forEach((file) => {
      const formattedFileName = `${new Date().toISOString()}-${file.name}`;
      const key =
        "product-other-images/" +
        formattedFileName.replace(/:/g, "-").replace(/\./g, "-");
      uploadPromises.push(uploadFile(file as File, key));
    });
  }

  try {
    const uploadResponses = await Promise.all(uploadPromises);
    console.log(uploadResponses);
    return Response.json({ message: "Success", data: uploadResponses });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Error uploading images" },
      { status: 500 }
    );
  }
}
// TODO:
// save the file name in db
// delete existing saved file names and files from aws
