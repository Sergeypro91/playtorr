import { IsArray, IsOptional, IsString } from 'class-validator';
import { IPerson } from '@app/common/interfaces';

export class GetPersonDataDto {
	@IsString()
	tmdbId: string;
}

export class PersonDetailDataDto implements IPerson {
	@IsArray()
	movies: string[];

	@IsArray()
	shows: string[];

	@IsString()
	lastUpdate: string;

	@IsString()
	tmdbId: string;

	@IsOptional()
	@IsString()
	imdbId?: string;

	@IsOptional()
	@IsString()
	photo?: string;

	@IsOptional()
	@IsString()
	birthday?: string;

	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	biography?: string;
}
