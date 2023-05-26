import WebTorrent from 'webtorrent';
import { onDestroy } from './onDestroy';
import { torrentLogger as logger } from './torrentLogger';

type torrentErrorHandlingArgs = {
	client: WebTorrent.Instance;
	message?: string;
	reject?: (reason?: any) => void;
};

export const torrentErrorHandling = ({
	client,
	message,
	reject,
}: torrentErrorHandlingArgs) => {
	return (error: string | Error) => {
		logger({ error, warn: message });

		if (reject) {
			reject(error);
		}

		// client.destroy(onDestroy());
	};
};
