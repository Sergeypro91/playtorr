import { MediaType } from '@app/common/types';

export type IPersonPicture = {
	tmdbId?: string;
	imdbId?: string;
	type?: MediaType;
};

export interface IPerson {
	movies: IPersonPicture[];
	tvs: IPersonPicture[];
	tmdbId: string;
	imdbId?: string;
	photo?: string;
	birthday?: string;
	name?: string;
	biography?: string;
}
