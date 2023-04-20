import { IsNumber } from 'class-validator';

export class PaginationDto {
	@IsNumber()
	page: number;

	@IsNumber()
	totalPages: number;

	@IsNumber()
	totalResults: number;
}
