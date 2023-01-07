import { Injectable, LoggerService } from '@nestjs/common';
import pino, { Logger } from 'pino';
import { ConfigService } from '@nestjs/config';
import { checkDirExist } from '@app/common';
import { format } from 'date-fns';

const levels = {
	emerg: 80,
	alert: 70,
	crit: 60,
	error: 50,
	warn: 40,
	notice: 30,
	info: 20,
	debug: 10,
};

const pinoConfig = (directoryName: string) => {
	checkDirExist(directoryName).then();

	const date = format(Date.now(), 'yyyy-MM-dd');
	const dest = `./${directoryName}/${date}`;

	return {
		dest, // omit for stdout
		sync: false, // Asynchronous logging
		// minLength: 4096, // Buffer before writing
	};
};

@Injectable()
export class RedefinedLoggerService implements LoggerService {
	pinoLogger: Logger;

	constructor(private readonly configService: ConfigService) {
		this.pinoLogger = pino(
			{
				level: process.env.PINO_LOG_LEVEL || 'info',
				customLevels: levels,
				useOnlyCustomLevels: true,
				formatters: {
					level: (label) => {
						return { level: label };
					},
				},
			},
			pino.destination(
				pinoConfig(this.configService.get('LOGS_FOLDER_NAME', 'logs')),
			),
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
}
