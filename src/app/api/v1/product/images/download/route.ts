import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest } from "next/server";
import { Readable } from "stream";

export async function POST(req: NextRequest) {
  const client = new S3Client({ region: process.env.AWS_REGION });
  const { searchParams } = new URL(req.url);
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  const key = searchParams.get("key") || "";
  const downloadParams = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    const command = new GetObjectCommand(downloadParams);
    const response = await client.send(command);

    const streamToString = (stream: Readable): Promise<string> =>
      new Promise((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const chunks: any[] = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () =>
          resolve(Buffer.concat(chunks).toString("utf-8"))
        );
      });

    const fileContent = await streamToString(response.Body as Readable);
    console.log("File content:", fileContent);
    // return fileContent;
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
  return Response.json({ message: "Success" });
}
