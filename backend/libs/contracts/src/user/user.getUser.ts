import { Role } from '@app/interfaces/user/user.interface';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export namespace UserGetUser {
	export const topic = 'user.getUser.command';

	export class Request {
		@IsEmail()
		email: string;

		@IsNumber()
		tgId: number;

		@IsString()
		role: Role;
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
