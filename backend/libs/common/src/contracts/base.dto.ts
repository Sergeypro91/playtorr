import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { MediaType } from '@app/common/types';

export class BasePictureDto {
	@IsString()
	tmdbId: string;

	// TODO refuse from null in imdbId
	@IsOptional()
	@IsString()
	imdbId: string | null;

	@IsEnum(MediaType)
	mediaType: MediaType;
}

export class PaginationDto {
	@IsNumber()
	page: number;

	@IsNumber()
	totalPages: number;

	@IsNumber()
	totalResults: number;
}
