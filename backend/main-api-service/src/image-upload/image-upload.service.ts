import { Injectable } from "@nestjs/common";
import { MinIOService } from "../minio/minio.service";
import { BufferedFile } from "../minio/minio.model";

@Injectable()
export class ImageUploadService {
  constructor(private readonly minIOService: MinIOService) {}

  async uploadImage(image: BufferedFile) {
    const uploaded_image = await this.minIOService.upload(image);

    return {
      image_url: uploaded_image.url,
      message: "Image upload successful",
    };
  }
}
