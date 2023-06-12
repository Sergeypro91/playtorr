import { RMQError, RMQService } from 'nestjs-rmq';
import {
	Get,
	Controller,
	HttpException,
	HttpStatus,
	Logger,
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiNotFoundResponse,
	ApiUnauthorizedResponse,
	ApiBadRequestResponse,
} from '@nestjs/swagger';
import { ErrorDto, GetPreviewResultDto, GetPublicPreview } from '@app/common';

@ApiTags('PublicPreview')
@Controller('preview')
export class PublicPreviewController {
	logger = new Logger(PublicPreviewController.name);

	constructor(private readonly rmqService: RMQService) {}

	@ApiOperation({
		summary:
			'JSON объект трендов Фильмов/Сериалов для Samsung PublicPreview',
	})
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiNotFoundResponse({ type: ErrorDto })
	@Get()
	async getPreview(): Promise<GetPreviewResultDto> {
		try {
			return await this.rmqService.send<
				GetPublicPreview.Request,
				GetPublicPreview.Response
			>(GetPublicPreview.topic, {});
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(
					error.message,
					error.code || HttpStatus.REQUEST_TIMEOUT,
				);
			}
		}
	}
}
