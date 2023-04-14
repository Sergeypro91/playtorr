import {
	IsString,
	IsOptional,
	IsNumber,
	IsEmail,
	IsEnum,
	IsArray,
	ValidateNested,
} from 'class-validator';
import {
	PartialType,
	OmitType,
	PickType,
	IntersectionType,
} from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MediaType, IRecentView, IUser } from '@app/common';
import { Role } from '@app/common/types';

export class RecentViewDto implements IRecentView {
	tmdbId: string;
	mediaType: MediaType;
}

export class DBUserDto implements IUser {
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

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => RecentViewDto)
	recentViews?: RecentViewDto[];
}

export class UserDto extends IntersectionType(
	OmitType(DBUserDto, ['passwordHash', 'role']),
	PartialType(PickType(DBUserDto, ['role'])),
) {
	@IsString()
	password: string;
}

export class TelegramUserDto extends IntersectionType(
	OmitType(DBUserDto, ['passwordHash', 'role', 'tgId']),
	PartialType(PickType(DBUserDto, ['role'])),
) {
	@IsString()
	password: string;

	@IsNumber()
	tgId: number;
}

export class EditUserDto extends IntersectionType(
	PickType(DBUserDto, ['email']),
	PartialType(OmitType(DBUserDto, ['email', 'passwordHash'])),
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
