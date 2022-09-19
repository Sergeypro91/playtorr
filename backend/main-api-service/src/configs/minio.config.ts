import { MinIOOptions } from "../minio/minio.interface";
import { ConfigService } from "@nestjs/config";

export const getMinIOConfig = (configService: ConfigService): MinIOOptions => {
  const endPoint = configService.get("MINIO_ENDPOINT");
  const port = configService.get("MINIO_PORT");
  const useSSL = false;
  const accessKey = configService.get("MINIO_ACCESS_KEY");
  const secretKey = configService.get("MINIO_SECRET_KEY");
  const bucketName = configService.get("MINIO_BUCKET_NAME");

  if (!endPoint) {
    throw new Error("MINIO_ENDPOINT - не задан");
  }
  if (!port) {
    throw new Error("MINIO_PORT - не задан");
  }
  if (!accessKey) {
    throw new Error("MINIO_ACCESS_KEY - не задан");
  }
  if (!secretKey) {
    throw new Error("MINIO_SECRET_KEY - не задан");
  }
  if (!bucketName) {
    throw new Error("MINIO_BUCKET_NAME - не задан");
  }

  return {
    endPoint,
    port: parseInt(port, 10),
    useSSL,
    accessKey,
    secretKey,
    bucketName,
  };
};
