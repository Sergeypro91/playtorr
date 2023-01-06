import {
	hoursPassed,
	EnumStatus,
	TrackerAccount,
	ITracker,
	CHROME_DIR,
	PARSERS,
} from '@app/common';

export const runParser = async (
	user: TrackerAccount,
	searchQuery: string,
	parserName: typeof PARSERS[number]['name'],
	tracker?: ITracker,
): Promise<ITracker> => {
	const parsersMap = new Map(PARSERS.map((parser) => [parser.name, parser]));
	const { url, func } = parsersMap.get(parserName);

	if (
		tracker &&
		hoursPassed(new Date(), tracker.lastUpdate) < 24 &&
		tracker.trackerStatus !== EnumStatus.ERROR
	) {
		return tracker;
	}

	return {
		...(await func({
			url,
			user,
			parserName,
			searchQuery,
			chromeDir: CHROME_DIR,
		})),
	};
};
