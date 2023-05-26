import { Logger } from '@nestjs/common';

type TorrentLoggerArgs = {
	log?: string;
	warn?: string;
	error?: string | Error;
	debug?: string;
};

export const torrentLogger = ({
	log,
	warn,
	error,
	debug,
}: TorrentLoggerArgs) => {
	const logger = new Logger('WebTorrentClient');

	if (log) {
		logger.log(log);
	}

	if (warn) {
		logger.warn(warn);
	}

	if (error) {
		logger.error(error);
	}

	if (debug) {
		logger.debug(debug);
	}
};
