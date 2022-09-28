import { Role } from '@app/interfaces/user/user.interface';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export namespace AuthValidateUser {
	export const topic = 'auth.validateUser.command';

	export class Request {
		@IsEmail()
		email: string;

		@IsString()
		password: string;
	}

	export class Response {
		@IsEmail()
		email: string;

		@IsString()
		passwordHash: string;

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

		@IsString()
		role: Role;

		@IsOptional()
		@IsString()
		image?: string;
	}
}
