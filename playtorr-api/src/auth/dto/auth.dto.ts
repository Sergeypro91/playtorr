import { IsOptional, IsString } from 'class-validator';

export class AuthDto {
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
	@IsString()
	tgId?: number;

	@IsOptional()
	@IsString()
	role?: string;

	@IsOptional()
	@IsString()
	image?: string;
}
