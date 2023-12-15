import { RMQError, RMQService } from 'nestjs-rmq';
import {
	Post,
	Body,
	HttpCode,
	HttpStatus,
	Controller,
	HttpException,
} from '@nestjs/common';
import {
	ApiTags,
	ApiOperation,
	ApiForbiddenResponse,
	ApiBadRequestResponse,
	ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorDto, EmailDto, MailerSendEmail } from '@app/common/contracts';

@ApiTags('Mailer')
@Controller('mailer')
export class MailerController {
	constructor(private readonly rmqService: RMQService) {}

	@ApiOperation({ summary: 'Отправка кода подтверждения' })
	@ApiUnauthorizedResponse({ type: ErrorDto })
	@ApiBadRequestResponse({ type: ErrorDto })
	@ApiForbiddenResponse({ type: ErrorDto })
	@HttpCode(HttpStatus.OK)
	@Post('confirmation')
	async test(@Body() dto: EmailDto): Promise<boolean> {
		try {
			return await this.rmqService.send<
				MailerSendEmail.Request,
				Promise<boolean>
			>(MailerSendEmail.topic, dto);
		} catch (error) {
			if (error instanceof RMQError) {
				throw new HttpException(error.message, error.code);
			}
		}
	}
}
