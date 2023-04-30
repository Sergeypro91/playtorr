import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { Body, Controller } from '@nestjs/common';
import { MinIODeleteFile, MinIOUploadFile } from '@app/common/contracts';
import { MinIOService } from './minio.service';

@Controller()
export class MinioController {
	constructor(private readonly minIOService: MinIOService) {}

	@RMQValidate()
	@RMQRoute(MinIOUploadFile.topic)
	async uploadFile(
		@Body() dto: MinIOUploadFile.Request,
	): Promise<MinIOUploadFile.Response> {
		return this.minIOService.upload(dto);
	}

	@RMQValidate()
	@RMQRoute(MinIODeleteFile.topic)
	async deleteFile(
		@Body() dto: MinIODeleteFile.Request,
	): Promise<MinIODeleteFile.Response> {
		return this.minIOService.delete(dto);
	}
}
