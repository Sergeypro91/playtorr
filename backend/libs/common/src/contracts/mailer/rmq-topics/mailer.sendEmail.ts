import { EmailDto } from '../dtos';

export namespace MailerSendEmail {
	export const topic = 'mailer.sendEmail.command';

	export class Request extends EmailDto {}
}
