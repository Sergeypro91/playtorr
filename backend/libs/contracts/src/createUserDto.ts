import {
	IsString,
	IsOptional,
	IsNumber,
	IsEmail,
	IsEnum,
} from 'class-validator';
import { Role } from '@app/interfaces';

export class LoginUserDto {
	@IsEmail()
	email: string;

	@IsString()
	password: string;
}

export class CreateUserDto {
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
	@IsEnum(Role)
	role?: Role;

	@IsOptional()
	@IsString()
	image?: string;
}

export class DBUserDto {
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

	@IsEnum(Role)
	role: Role;

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

	@IsEnum(Role)
	role: Role;

	@IsOptional()
	@IsString()
	image?: string;
}

export class UserSession {
	@IsEmail()
	email: string;

	@IsOptional()
	@IsNumber()
	tgId?: number;

	@IsEnum(Role)
	role: Role;
}

export class UsersEmailDto {
	@IsEmail({}, { each: true })
	users: string[];
}
