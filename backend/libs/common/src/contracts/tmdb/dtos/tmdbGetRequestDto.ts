import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class TmdbGetRequestDto {
	@IsString()
	route: string;

	@IsOptional()
	@IsNumber()
	version?: number;

	@IsOptional()
	@IsArray()
	queries?: string[];
}
