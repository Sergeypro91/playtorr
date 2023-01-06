import { IsString, IsNumber, IsOptional } from 'class-validator';

export class ErrorDto {
	@IsNumber()
	statusCode: number;

	@IsString()
	message: string;

	@IsOptional()
	@IsString()
	error?: string;
}
