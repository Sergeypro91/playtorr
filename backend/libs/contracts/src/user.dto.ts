import {
	IsString,
	IsOptional,
	IsNumber,
	IsEmail,
	IsEnum,
	IsMongoId,
} from 'class-validator';
import { MediaType, Role } from '@app/interfaces';
import {
	PartialType,
	OmitType,
	PickType,
	IntersectionType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class DBUserDto {
	@IsMongoId()
	id: string;

	@IsEmail()
	email: string;

	@IsOptional()
	@IsString()
	passwordHash?: string;

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

export class UserDto extends IntersectionType(
	OmitType(DBUserDto, ['id', 'passwordHash', 'role']),
	PartialType(PickType(DBUserDto, ['role'])),
) {
	@IsString()
	password: string;
}

export class TelegramUserDto extends IntersectionType(
	OmitType(DBUserDto, ['id', 'passwordHash', 'role', 'tgId']),
	PartialType(PickType(DBUserDto, ['role'])),
) {
	@IsString()
	password: string;

	@IsNumber()
	tgId: number;
}

export class EditUserDto extends IntersectionType(
	PickType(DBUserDto, ['email']),
	PartialType(OmitType(DBUserDto, ['id', 'email', 'passwordHash'])),
) {}

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
	editableUser: EditUserDto;

	@Type(() => UserSessionDto)
	editingUser: UserSessionDto;
}

export class PushUserRecentViewDto {
	@IsEmail()
	email: string;

	@IsString()
	tmdbId: string;

	@IsString()
	mediaType: MediaType;
}
