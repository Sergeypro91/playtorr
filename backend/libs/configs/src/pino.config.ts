import * as fse from 'fs-extra';
import { format } from 'date-fns';
import pino from 'pino';
import { LoggerModuleAsyncParams } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';

const checkDirExist = async (directory: string) => {
	try {
		await fse.ensureDirSync(directory);
	} catch (error) {
		console.log('Logs folder create.');
	}
};

const definedParams = async (
	configService: ConfigService<Record<string, unknown>, false>,
) => {
	const directoryName = await configService.get('LOGS_FOLDER_NAME', 'logs');

	await checkDirExist(`./${directoryName}`);

	const date = format(Date.now(), 'yyyy-MM-dd');
	const dest = `./${directoryName}/${date}`;

	return {
		pinoHttp: {
			stream: pino.destination({
				dest, // omit for stdout
				sync: false, // Asynchronous logging
				// minLength: 4096, // Buffer before writing
			}),
		},
	};
};

export const getPinoConfig = (): LoggerModuleAsyncParams => ({
	inject: [ConfigService],
	imports: [ConfigModule],
	useFactory: (configService: ConfigService) => definedParams(configService),
});
