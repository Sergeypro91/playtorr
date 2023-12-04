import { runParser } from '@app/common/utils';
import { ITracker } from '@app/common/interfaces';
import { GetTorrentsResponseDto } from '@app/common/contracts';
import { EnumStatus, RunParsersArgs } from '@app/common/types';

export const parse = async ({
	user,
	searchQuery,
	searchQueryData,
}: RunParsersArgs) => {
	let parseData: GetTorrentsResponseDto[];
	const trackersMap: Map<string, ITracker> = new Map(
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
			) as PromiseFulfilledResult<GetTorrentsResponseDto>[]
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
