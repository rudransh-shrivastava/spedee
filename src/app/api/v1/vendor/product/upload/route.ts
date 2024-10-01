// import { authOptions } from "@/lib/auth";
// import { connectDB } from "@/lib/mongodb";
// import { getServerSession } from "next-auth";
// import { NextRequest } from "next/server";
// import z from "zod";
// import multer from "multer";
// import AWS from "aws-sdk";
// import Product from "@/models/Product";
// /*
// TODO: Left out properties to save
// - vendorEmail
// */

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_REGION,
// });

// const s3 = new AWS.S3();

// // Configure multer storage
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// const productSchema = z.object({
//   name: z.string(),
//   description: z.string(),
//   priceInPaise: z.number(),
//   salePriceInPaise: z.number(),
//   attributes: z.record(z.array(z.string())),
//   category: z.string(),
//   stock: z.number(),
//   bestSeller: z.boolean(),
//   bestSellerPriority: z.number(),
// });

// export const config = {
//   api: {
//     bodyParser: false, // Disable Next.js body parsing to handle multipart/form-data
//   },
// };

export async function POST() {
  return Response.json({ message: "testing " });
}
//   await connectDB();
//   const session = await getServerSession(authOptions);

//   if (!session) {
//     return Response.json({ message: "Unauthorized" }, { status: 401 });
//   }
//   if (session.user.role !== "vendor") {
//     return Response.json({ message: "Forbidden" }, { status: 403 });
//   }

//   const uploadMiddleware = upload.fields([
//     { name: "image", maxCount: 1 },
//     { name: "otherImages", maxCount: 10 },
//   ]);

//   return new Promise((resolve, reject) => {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     uploadMiddleware(req, {}, async (err: any) => {
//       if (err) {
//         return Response.json(
//           { message: "Error uploading images" },
//           { status: 500 }
//         );
//       }

//       // Access the uploaded files
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const files = (req as any).files as {
//         [fieldname: string]: MulterFile[];
//       };
//       const imageFile = files["image"] ? files["image"][0] : null;
//       const otherImageFiles = files["otherImages"] || [];

//       if (!imageFile) {
//         return Response.json(
//           { message: "Main image is required" },
//           { status: 400 }
//         );
//       }

//       // Upload main image to S3
//       const uploadToS3 = (file: MulterFile) => {
//         if (!process.env.AWS_S3_BUCKET_NAME) {
//           throw new Error("AWS_S3_BUCKET_NAME is not defined");
//         }

//         const params = {
//           Bucket: process.env.AWS_S3_BUCKET_NAME,
//           Key: `${Date.now()}-${file.originalname}`,
//           Body: file.buffer,
//           ContentType: file.mimetype,
//         };

//         return s3.upload(params).promise();
//       };

//       try {
//         const mainImageUpload = await uploadToS3(imageFile);
//         const otherImagesUpload = await Promise.all(
//           otherImageFiles.map(uploadToS3)
//         );

//         const productData = {
//           ...req.body,
//           image: mainImageUpload.Location,
//           otherImages: otherImagesUpload.map((upload) => upload.Location),
//         };

//         const product = new Product(productData);
//         await product.save();

//         return Response.json(product, { status: 201 });
//       } catch (error) {
//         return Response.json(
//           { message: "Error saving product" },
//           { status: 500 }
//         );
//       }
//     });
//   });
// }
