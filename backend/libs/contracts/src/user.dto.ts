import {
	IsString,
	IsOptional,
	IsNumber,
	IsEmail,
	IsEnum,
} from 'class-validator';
import { Role } from '@app/interfaces';
import {
	PartialType,
	OmitType,
	PickType,
	IntersectionType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';

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

export class DBUserProtectDto extends OmitType(DBUserDto, ['passwordHash']) {}

export class UserDto extends IntersectionType(
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

export class EditUserSessionDto {
	@Type(() => EditUserDto)
	user: EditUserDto;

	@Type(() => UserSessionDto)
	userSession: UserSessionDto;
}
