import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { IPerson, IPersonPicture } from '@app/common/interfaces';
import { MediaType } from '@app/common/types';

export class GetPersonDataDto {
	@IsString()
	tmdbId: string;
}

export class PersonPictureDto implements IPersonPicture {
	@IsOptional()
	@IsString()
	tmdbId?: string;

	@IsOptional()
	@IsString()
	imdbId?: string;

	@IsOptional()
	@IsEnum(() => MediaType)
	type?: MediaType;
}

export class PersonDetailDataDto implements IPerson {
	@IsArray()
	@Type(() => PersonPictureDto)
	movies: PersonPictureDto[];

	@IsArray()
	@Type(() => PersonPictureDto)
	tvs: PersonPictureDto[];

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
