import {
	Body,
	Post,
	Delete,
	Controller,
	UploadedFile,
	UseInterceptors,
	HttpException,
} from '@nestjs/common';
import {
	ApiTags,
	ApiBody,
	ApiConsumes,
	ApiOperation,
	ApiNotFoundResponse,
	ApiBadRequestResponse,
	ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import {
	MinIODeleteFile,
	MinIOUploadFile,
	ErrorDto,
	MinIOFileUrlDto,
	MinIODeletedFileDto,
	MinIODeletingConfirmDto,
} from '@app/common';
import { RMQError, RMQService } from 'nestjs-rmq';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('File')
@Controller('file')
export class MinIOController {
	constructor(private readonly rmqService: RMQService) {}

	@ApiOperation({ summary: 'Загрузка файлов на сервер' })
	@ApiInternalServerErrorResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiConsumes('multipart/form-data')
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				file: {
					type: 'string',
					format: 'binary',
				},
			},
		},
	})
	@Post()
	@UseInterceptors(FileInterceptor('file'))
	async uploadFile(
		@UploadedFile() file: Express.Multer.File,
	): Promise<MinIOFileUrlDto> {
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
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(error.message, error.code);
			}
		}
	}

	@ApiOperation({ summary: 'Удаление файлов с сервера' })
	@ApiNotFoundResponse({ type: ErrorDto })
	@Delete()
	async deleteFile(
		@Body() filename: MinIODeletedFileDto,
	): Promise<MinIODeletingConfirmDto> {
		try {
			return await this.rmqService.send<
				MinIODeleteFile.Request,
				MinIODeleteFile.Response
			>(MinIODeleteFile.topic, filename);
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(error.message, error.code);
			}
		}
	}
}
