import { format } from 'date-fns';

export enum BaseOption {
	RESET = '\x1b[0m',
}

export enum BaseFg {
	RED = '\x1b[31m',
	GREEN = '\x1b[32m',
	YELLOW = '\x1b[33m',
	WHITE = '\x1b[37m',
	BLACK = '\x1b[30m',
}

export enum BaseBg {
	RED = '\x1b[41m',
	GREEN = '\x1b[42m',
	YELLOW = '\x1b[43m',
	WHITE = '\x1b[47m',
	BLACK = '\x1b[40m',
}

export const buildLog = (
	service: string,
	logMessage: string,
	serviceFg: '' | BaseFg | BaseOption = '',
	serviceBg: '' | BaseBg | BaseOption = '',
	logMessageFg: '' | BaseFg | BaseOption = '',
	logMessageBg: '' | BaseBg | BaseOption = '',
) => {
	const serviceName = () => {
		let newName = service;

		if (service.length > 9) {
			return `${newName.slice(0, 6)}...`;
		}

		if (service.length < 9) {
			for (let i = service.length; i < 9; i++) {
				newName += ' ';
			}
		}

		return newName;
	};
	console.log(
		`${serviceFg}${serviceBg}[${serviceName()}] `,
		`-${BaseOption.RESET}`,
		format(new Date(), 'MM/dd/yyyy, h:mm:ss a'),
		'   ',
		`${logMessageFg}${logMessageBg}${logMessage}${BaseOption.RESET}`,
	);
};
