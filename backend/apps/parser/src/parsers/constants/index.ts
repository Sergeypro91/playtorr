import { ParserArgs } from '@app/types';
import { parseRutor } from '../rutor';
import { parseNnmClub } from '../nnmclub';
import { parseRuTracker } from '../rutracker';

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
