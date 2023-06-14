import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { MediaType } from '@app/common/types';
import { ApiProperty } from '@nestjs/swagger';

export class BasePictureDto {
	@ApiProperty()
	@IsString()
	tmdbId: string;

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	imdbId?: string | null;

	@ApiProperty({ enum: MediaType })
	@IsEnum(MediaType)
	mediaType: MediaType;
}

export class PaginationDto {
	@ApiProperty()
	@IsNumber()
	page: number;

	@ApiProperty()
	@IsNumber()
	totalPages: number;

	@ApiProperty()
	@IsNumber()
	totalResults: number;
}
