import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UserDto {
	@IsString()
	email: string;

	@IsString()
	password: string;

	@IsOptional()
	@IsString()
	nickname?: string;

	@IsOptional()
	@IsString()
	firstName?: string;

	@IsOptional()
	@IsString()
	lastName?: string;

	@IsOptional()
	@IsNumber()
	tgId?: number;

	@IsOptional()
	@IsString()
	role?: string;

	@IsOptional()
	@IsString()
	image?: string;
}
