import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./s3";

export const uploadToS3 = async (file: File) => {
  const buffer = Buffer.from(await file.arrayBuffer());

  const fileName = `avatars/${Date.now()}-${file.name}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileName,
    Body: buffer,
    ContentType: file.type,
  });

  await s3.send(command);

  return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
};