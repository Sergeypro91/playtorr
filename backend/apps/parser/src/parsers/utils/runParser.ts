import { EnumStatus } from '@app/interfaces';
import { CHROME_DIR } from '@app/constants';
import { TorrentDto } from '@app/contracts';
import { PARSER } from '../constants';
import { TorrentUser } from '../types';
import { ParserReturn, ParserTorrent } from './stepHandle';

export const runParser = async (
	user: TorrentUser,
	searchQuery: string,
	parser: typeof PARSER.nnm,
	parserFunc: (payload: ParserTorrent) => Promise<ParserReturn>,
): Promise<TorrentDto> => {
	const torrentFiles = await parserFunc({
		url: parser.url,
		user,
		searchQuery,
		chromeDir: CHROME_DIR,
	});

	return {
		torrentLabel: parser.name,
		torrentStatus: EnumStatus.FINISHED,
		torrentFiles,
	};
};
