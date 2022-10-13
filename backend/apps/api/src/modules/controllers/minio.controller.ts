import {
	Controller,
	UnauthorizedException,
	Body,
	Post,
	UseInterceptors,
	UploadedFile,
	Delete,
} from '@nestjs/common';
import { MinIODeleteFile, MinIOUploadFile } from '@app/contracts';
import { RMQService } from 'nestjs-rmq';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file')
export class MinIOController {
	constructor(private readonly rmqService: RMQService) {}

	@Post()
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(@UploadedFile() file: Express.Multer.File) {
		const fileDto = {
			name: file.originalname,
			mimetype: file.mimetype,
			binaryBuffer: Buffer.from(file.buffer).toString('base64'),
		};
		try {
			return await this.rmqService.send<
				MinIOUploadFile.Request,
				MinIOUploadFile.Response
			>(MinIOUploadFile.topic, fileDto);
		} catch (err) {
			if (err instanceof Error) {
				throw new UnauthorizedException(err.message);
			}
		}
	}

	@Delete()
	async deleteFile(@Body() dto: MinIODeleteFile.Request) {
		try {
			return await this.rmqService.send<
				MinIODeleteFile.Request,
				MinIODeleteFile.Response
			>(MinIODeleteFile.topic, dto);
		} catch (err) {
			if (err instanceof Error) {
				throw new UnauthorizedException(err.message);
			}
		}
	}
}
