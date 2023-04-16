import { IPerson } from '@app/common';

export class PersonEntity implements IPerson {
	movies: string[];
	shows: string[];
	tmdbId: string;
	imdbId?: string;
	photo?: string;
	birthday?: string;
	name?: string;
	biography?: string;

	constructor(person) {
		this.movies = person.movies;
		this.shows = person.shows;
		this.tmdbId = person.tmdbId;
		this.imdbId = person.imdbId;
		this.photo = person.photo;
		this.birthday = person.birthday;
		this.name = person.name;
		this.biography = person.biography;
	}
}
