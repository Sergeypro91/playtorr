import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { Body, Controller } from '@nestjs/common';
import { MailerSendEmail } from '@app/common/contracts';
import { MailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
	constructor(private readonly mailerService: MailerService) {}

	@RMQValidate()
	@RMQRoute(MailerSendEmail.topic)
	async sendUserConfirmation(
		@Body() credentials: MailerSendEmail.Request,
	): Promise<boolean> {
		return this.mailerService.sendUserConfirmation(credentials);
	}
}
