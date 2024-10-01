import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";
import z from "zod";
// import multer from "multer";

/*
TODO: Left out properties to save
- image
- otherImages
- vendorEmail
*/

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// const s3 = new AWS.S3();

// Configure multer storage
// const storage = multer.memoryStorage(); // Use memory storage to avoid saving files locally
// const upload = multer({ storage: storage });

const productSchema = z.object({
  name: z.string(),
  description: z.string(),
  priceInPaise: z.number(),
  salePriceInPaise: z.number(),
  attributes: z.record(z.array(z.string())),
  category: z.string(),
  stock: z.number(),
  bestSeller: z.boolean(),
  bestSellerPriority: z.number(),
});
export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing to handle multipart/form-data
  },
};

export async function POST(req: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "vendor") {
    return Response.json({ message: "Forbidden" }, { status: 403 });
  }
}
