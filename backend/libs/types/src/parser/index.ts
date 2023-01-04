import { ISearchQueryData } from '@app/interfaces';
import { PARSERS } from '../../../../apps/parser/src';

export type RunParsersArgs = {
	user: TrackerAccount;
	searchQuery: string;
	searchQueryData: ISearchQueryData;
};

export type ParserArgs = {
	url: string;
	user: TrackerAccount;
	parserName: typeof PARSERS[number]['name'];
	searchQuery: string;
	chromeDir?: string;
};

export type TrackerAccount = {
	login: string;
	password: string;
};

export type Torrent = {
	name: string;
	size: string;
	link: string;
	seeders: string;
	leeches: string;
};
