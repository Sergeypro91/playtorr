import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MediaType } from '@app/common/types';
import { SearchQueryDataDto } from './parser.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ParsePictureTorrentsRequestDto {
	@ApiProperty()
	@IsString()
	tmdbId: string;

	@ApiProperty({ nullable: true, required: false })
	@IsOptional()
	@IsString()
	imdbId?: string | null;

	@ApiProperty({ enum: MediaType })
	@IsEnum(MediaType)
	mediaType: MediaType;

	@ApiProperty()
	@IsString()
	searchQuery: string;
}

export class ParsePictureTorrentsResponseDto extends SearchQueryDataDto {
	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	message?: string;
}
