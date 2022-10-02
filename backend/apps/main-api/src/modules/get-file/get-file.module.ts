import { Module } from '@nestjs/common';
import { GetFileService } from './get-file.service';
import { GetFileController } from './get-file.controller';
import { MinIOModule } from '../minio/minio.module';

@Module({
  imports: [MinIOModule],
  providers: [GetFileService],
  controllers: [GetFileController],
})
export class GetFileModule {}
