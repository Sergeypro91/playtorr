import { IsString, IsOptional } from 'class-validator';

export class TelegramUserDto {
	@IsString()
	id: string;

	@IsString()
	first_name: string;

	@IsOptional()
	@IsString()
	last_name?: string;

	@IsOptional()
	@IsString()
	username?: string;

	@IsOptional()
	@IsString()
	photo_url?: string;

	@IsString()
	auth_date: string;

	@IsString()
	hash: string;
}
