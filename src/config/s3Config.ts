import { S3Client, DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const deleteFileFromS3 = async (fileKey: string) => {
  console.log("deleteFileFromS3 fileKey: ", fileKey);

  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileKey, // Example: "uploads/image1.jpg"
    });

    const response = await s3.send(command);
    console.log("File deleted successfully:", response);

    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

export const bulkDeleteFromS3 = async (fileKeys: string[]) => {
  try {
    const command = new DeleteObjectsCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Delete: {
        Objects: fileKeys.map((key) => ({
          Key: key,
        })),
        Quiet: false, // optional, returns deleted file details
      },
    });

    const response = await s3.send(command);

    console.log("Deleted files:", response.Deleted);
    console.log("Errors (if any):", response.Errors);

    return response;
  } catch (error) {
    console.error("Bulk delete error:", error);
    throw error;
  }
};