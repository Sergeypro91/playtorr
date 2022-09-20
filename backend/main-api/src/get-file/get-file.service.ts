import { Injectable } from "@nestjs/common";
import { MinIOService } from "../minio/minio.service";

@Injectable()
export class GetFileService {
  constructor(private readonly minIOService: MinIOService) {}

  downloadFile(filename: string) {
    return this.minIOService.getFile(filename);
  }
}
