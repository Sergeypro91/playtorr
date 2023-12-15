import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EmailDto } from '@app/common/contracts';
import { ApiError, SEND_MAIL_ERROR } from '@app/common/constants';

@Injectable()
export class MailerService {
	private transporter: nodemailer.Transporter;
	logger: Logger;
	mailUser: string;
	mailPass: string;

	constructor(private readonly configService: ConfigService) {
		this.logger = new Logger(MailerService.name);
		this.mailUser = this.configService.get('MAIL_USER', '');
		this.mailPass = this.configService.get('MAIL_PASSWORD', '');
		this.transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: this.mailUser,
				pass: this.mailPass,
			},
		});
	}

	public async sendUserConfirmation({
		to,
		subject,
		text,
	}: EmailDto): Promise<boolean> {
		const mailOptions = { from: this.mailUser, to, subject, text };

		try {
			await this.transporter.sendMail(mailOptions);
		} catch (error) {
			const errorCode =
				error['responseCode'] ?? HttpStatus.SERVICE_UNAVAILABLE;
			const errorMessage = error['response'] ?? SEND_MAIL_ERROR;

			throw new ApiError(errorCode, errorMessage);
		}

		Logger.log(`Send mail to ${to} success.`);

		return true;
	}
}
