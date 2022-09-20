import {
  Post,
  Controller,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { ImageUploadService } from "./image-upload.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { BufferedFile } from "../minio/minio.model";

@Controller("image-upload")
export class ImageUploadController {
  constructor(private readonly imageUploadService: ImageUploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor("image"))
  async uploadImage(@UploadedFile() image: BufferedFile) {
    return await this.imageUploadService.uploadImage(image);
  }
}
