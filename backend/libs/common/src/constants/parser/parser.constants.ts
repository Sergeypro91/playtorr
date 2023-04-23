import { ParserArgs } from '@app/common';
import { parseRutor } from './rutor';
import { parseNnmClub } from './nnmclub';
import { parseRuTracker } from './rutracker';

export const CHROME_DIR =
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
export const PICTURE_TORRENTS_EXIST_ERROR =
	'Торренты для данного кино/сериала уже существуют';

export const STEP_DELAY = 30000;

export const PARSERS = [
	{
		name: 'nnmclub',
		url: 'https://nnmclub.to',
		func: async (args: ParserArgs) => parseNnmClub(args),
	},
	{
		name: 'rutor',
		url: 'https://rutor.org',
		func: async (args: ParserArgs) => parseRutor(args),
	},
	{
		name: 'rutracker',
		url: 'https://rutracker.org',
		func: async (args: ParserArgs) => parseRuTracker(args),
	},
] as const;
