import {
	IsString,
	IsOptional,
	IsNumber,
	IsEmail,
	IsEnum,
} from 'class-validator';
import {
	PartialType,
	OmitType,
	PickType,
	IntersectionType,
} from '@nestjs/mapped-types';
import { Role } from '@app/interfaces';

export class LoginUserDto {
	@IsEmail()
	email: string;

	@IsString()
	password: string;
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

export class CreateUserDto extends IntersectionType(
	OmitType(DBUserDto, ['passwordHash', 'role']),
	PartialType(PickType(DBUserDto, ['role'])),
) {
	@IsString()
	password: string;
}

export class EditUserDto extends OmitType(PartialType(DBUserDto), [
	'passwordHash',
]) {}

export class UserSessionDto extends PickType(DBUserDto, [
	'email',
	'tgId',
	'role',
]) {}

export class FindUserByDto {
	@IsString()
	type: string;

	@IsString()
	id: string;
}

export class UsersEmailDto {
	@IsEmail({}, { each: true })
	users: string[];
}
