import {
	IsString,
	IsArray,
	IsOptional,
	IsNumber,
	IsEmail,
} from 'class-validator';
import { Request } from 'express';

export class UserDto {
	@IsEmail()
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

export class EditUserDto {
	@IsOptional()
	@IsEmail()
	email?: string;

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

export type UserSession = Pick<UserDto, 'email' | 'tgId' | 'role'>;

export interface RequestWithUserSession extends Request {
	user: UserSession;
}

export class UsersEmailDto {
	@IsArray()
	@IsString({ each: true })
	users: string[];
}
