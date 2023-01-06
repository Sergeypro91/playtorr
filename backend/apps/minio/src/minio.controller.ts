import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { Body, Controller } from '@nestjs/common';
import { MinIODeleteFile, MinIOUploadFile } from '@app/common';
import { MinIOService } from './minio.service';

@Controller()
export class MinioController {
	constructor(private readonly minIOService: MinIOService) {}

	@RMQValidate()
	@RMQRoute(MinIOUploadFile.topic)
	async uploadFile(
		@Body() fileDto: MinIOUploadFile.Request,
	): Promise<MinIOUploadFile.Response> {
		return this.minIOService.upload(fileDto, ['jpeg', 'png']);
	}

	@RMQValidate()
	@RMQRoute(MinIODeleteFile.topic)
	async deleteFile(
		@Body() { filename }: MinIODeleteFile.Request,
	): Promise<MinIODeleteFile.Response> {
		return this.minIOService.delete(filename);
	}
}
