import { Logger } from 'pino';
import { ConfigService } from '@nestjs/config';
import { Injectable, LoggerService } from '@nestjs/common';
import { getPinoConfig } from '@app/common/configs';

@Injectable()
export class RedefinedLoggerService implements LoggerService {
	pinoLogger: Logger;

	constructor(private readonly configService: ConfigService) {
		this.pinoLogger = getPinoConfig(
			this.configService.get('LOGS_FOLDER_NAME', 'logs'),
		);
	}

	error(message: any, ...optionalParams: any[]): any {
		this.pinoLogger.info(message, optionalParams);
	}

	log(message: any, ...optionalParams: any[]): any {
		this.pinoLogger.info(message, optionalParams);
	}

	warn(message: any, ...optionalParams: any[]): any {
		this.pinoLogger.info(message, optionalParams);
	}

	debug(message: any, ...optionalParams: any[]): any {
		this.pinoLogger.info(message, optionalParams);
	}

	verbose(message: any, ...optionalParams: any[]): any {
		this.pinoLogger.info(message, optionalParams);
	}
}
