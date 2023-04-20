import { PersonEntity } from '../entities';
import { TmdbPersonDto } from '@app/common';
import { MediaType } from '@app/common/types';

export const adaptPerson = ({
	details,
	movies,
	tvs,
}: TmdbPersonDto): PersonEntity => {
	const simplify = (arr: { id: number }[], mediaType: MediaType) =>
		arr.map((elem) => ({
			tmdbId: elem.id.toString(),
			mediaType,
		}));
	const combiner = (
		{
			cast,
			crew,
		}: {
			cast: { id: number }[];
			crew: { id: number }[];
		},
		mediaType: MediaType,
	) => [
		...new Set([
			...simplify(cast, mediaType),
			...simplify(crew, mediaType),
		]),
	];

	return {
		movies: combiner(movies, MediaType.MOVIE),
		tvs: combiner(tvs, MediaType.TV),
		tmdbId: details['id'].toString(),
		imdbId: details['imdb_id'],
		photo: details['profile_path'],
		birthday: details?.['birthday'],
		name: details?.['name'],
		biography: details?.['biography'],
	};
};
