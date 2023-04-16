import { PersonEntity } from '../../entities';

type PersonDetails = {
	birthday: string | null;
	known_for_department: string;
	deathday: null | string;
	id: number;
	name: string;
	also_known_as: [string];
	gender: number;
	biography: string;
	popularity: number;
	place_of_birth: string | null;
	profile_path: string | null;
	adult: boolean;
	imdb_id: string;
	homepage: null | string;
};

type CastType = {
	character: string;
	credit_id: string;
	release_date: string;
	vote_count: number;
	video: boolean;
	adult: boolean;
	vote_average: number;
	title: string;
	genre_ids: [number];
	original_language: string;
	original_title: string;
	popularity: number;
	id: number;
	backdrop_path: string | null;
	overview: string;
	poster_path: string | null;
};

type CrewType = {
	id: number;
	department: string;
	original_language: string;
	original_title: string;
	job: string;
	overview: string;
	vote_count: number;
	video: boolean;
	poster_path: string | null;
	backdrop_path: string | null;
	title: string;
	popularity: number;
	genre_ids: [number];
	vote_average: number;
	adult: boolean;
	release_date: string;
	credit_id: string;
};

type PersonParticipant = {
	cast: CastType[];
	crew: CrewType[];
};

type PersonAdapterType = {
	details: PersonDetails;
	movie: PersonParticipant;
	tv: PersonParticipant;
};

export const personAdapter = ({
	details,
	movie,
	tv,
}: PersonAdapterType): PersonEntity => {
	const simplify = (arr: (CastType | CrewType)[]) =>
		arr.map((elem) => elem.id.toString());
	const combiner = ({ cast, crew }: PersonParticipant) => [
		...new Set([...simplify(cast), ...simplify(crew)]),
	];

	return {
		movies: combiner(movie),
		shows: combiner(tv),
		tmdbId: details['id'].toString(),
		imdbId: details['imdb_id'],
		photo: details['profile_path'],
		birthday: details?.['birthday'],
		name: details?.['name'],
		biography: details?.['biography'],
	};
};
