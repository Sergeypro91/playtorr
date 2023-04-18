import { IPerson, IPersonPicture } from '@app/common';

export class PersonEntity implements IPerson {
	movies: IPersonPicture[];
	tvs: IPersonPicture[];
	tmdbId: string;
	imdbId?: string;
	photo?: string;
	birthday?: string;
	name?: string;
	biography?: string;

	constructor(person) {
		this.movies = person.movies;
		this.tvs = person.tvs;
		this.tmdbId = person.tmdbId;
		this.imdbId = person.imdbId;
		this.photo = person.photo;
		this.birthday = person.birthday;
		this.name = person.name;
		this.biography = person.biography;
	}
}
