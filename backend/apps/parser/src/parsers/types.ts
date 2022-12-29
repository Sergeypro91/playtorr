import { SearchQueryDataDto } from '@app/contracts';

export type RunParsersArgs = {
	user: TorrentUser;
	searchQuery: string;
	searchQueryData: SearchQueryDataDto;
};

export type TorrentUser = {
	login: string;
	password: string;
};
