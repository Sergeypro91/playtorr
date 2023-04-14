import pino from 'pino';
import { format } from 'date-fns';
import { checkDirExist } from '@app/common/utils';
import { LEVELS } from '@app/common/constants';

export const pinoConfig = (directoryName: string) => {
	checkDirExist(directoryName).then();

	const date = format(Date.now(), 'yyyy-MM-dd');
	const dest = `./${directoryName}/${date}`;

	return pino(
		{
			level: process.env.PINO_LOG_LEVEL || 'info',
			customLevels: LEVELS,
			useOnlyCustomLevels: true,
			formatters: {
				level: (label) => {
					return { level: label };
				},
			},
		},
		pino.destination({
			dest, // omit for stdout
			sync: false, // Asynchronous logging
			// minLength: 4096, // Buffer before writing
		}),
	);
};
