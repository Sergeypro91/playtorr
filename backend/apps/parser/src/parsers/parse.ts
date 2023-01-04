import { TrackerDto } from '@app/contracts';
import { EnumStatus, RunParsersArgs } from '@app/types';
import { runParser } from "./utils";

export const parse = async ({
	user,
	searchQuery,
	searchQueryData,
}: RunParsersArgs) => {
	let parseData: TrackerDto[];
	const trackersMap = new Map(
		searchQueryData.trackers.map((tracker) => [
			tracker.trackerLabel,
			tracker,
		]),
	);

	await Promise.allSettled([
		runParser(user, searchQuery, 'nnmclub', trackersMap.get('nnmclub')),
		runParser(user, searchQuery, 'rutor', trackersMap.get('rutor')),
		runParser(user, searchQuery, 'rutracker', trackersMap.get('rutracker')),
	]).then((results) => {
		parseData = (
			results.filter(
				({ status }) => status === 'fulfilled',
			) as PromiseFulfilledResult<TrackerDto>[]
		).map(({ value }) => value);
	});

	searchQueryData.searchStatus = EnumStatus.FINISHED;
	searchQueryData.trackers = parseData;

	return searchQueryData;
};

// interface IParser extends ParserArgs {
// 	runParse(): void;
// }
//
// type ParserArgs = {
// 	searchQuery: string;
// 	torrentUser: TorrentUser;
// 	parserName: typeof PARSERS[number]['name'],
// 	searchQueryData: SearchQueryDataDto;
// 	repository: PictureTorrentsRepository;
// };
//
// class Parser implements IParser {
// 	searchQuery: string;
// 	torrentUser: TorrentUser;
// 	searchQueryData: SearchQueryDataDto;
// 	repository: PictureTorrentsRepository;
//
// 	constructor({ searchQuery, torrentUser, searchQueryData, repository }: ParserArgs) {
// 		this.searchQuery = searchQuery;
// 		this.torrentUser = torrentUser;
// 		this.searchQueryData = searchQueryData;
// 		this.repository = repository;
// 	}
//
// 	async runParse() {
// 		console.log('TEST');
//
// 	}
// }
