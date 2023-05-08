import { torrentLogger as logger } from './torrentLogger';

export const onDestroy = (message?: string) => {
	return (error: string | Error) => {
		if (error) {
			logger({ error });
		} else {
			logger({
				debug: message ?? 'Client successfully closed',
			});
		}
	};
};
