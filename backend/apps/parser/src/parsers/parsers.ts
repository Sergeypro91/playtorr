import { TorrentDto } from '@app/contracts';
import { EnumStatus } from '@app/types';
import { RunParsersArgs } from './types';
import {
	parseNnm,
	parseRutor,
	parseRuTracker,
	PARSER,
	runParser,
} from '../parsers';

export const parsers = async ({
	user,
	searchQuery,
	searchQueryData,
}: RunParsersArgs) => {
	let parseData: TorrentDto[];

	await Promise.allSettled([
		runParser(user, searchQuery, PARSER.nnm, parseNnm),
		runParser(user, searchQuery, PARSER.rutor, parseRutor),
		runParser(user, searchQuery, PARSER.rutracker, parseRuTracker),
	]).then((results) => {
		parseData = (
			results.filter(
				({ status }) => status === 'fulfilled',
			) as PromiseFulfilledResult<TorrentDto>[]
		).map(({ value }) => value);
	});

	searchQueryData.lastUpdate = new Date().toISOString();
	searchQueryData.searchStatus = EnumStatus.FINISHED;
	searchQueryData.torrents = parseData;

	return searchQueryData;
};
