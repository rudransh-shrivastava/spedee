import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const client = new S3Client({ region: process.env.AWS_REGION });

export const uploadFile = async (file: File, key: string) => {
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

export const deleteFile = async (key: string) => {
  const deleteParams = {
    Bucket: "spedee-produt-images",
    Key: key,
  };
  const command = new DeleteObjectCommand(deleteParams);
  return client.send(command);
};
export const getPublicImageUrl = (key: string) => {
  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};
