import {
	IsString,
	IsOptional,
	IsEmail,
	IsEnum,
	IsObject,
	IsArray,
} from 'class-validator';
import {
	PickType,
	OmitType,
	ApiProperty,
	PartialType,
	IntersectionType,
} from '@nestjs/swagger';
import { IUser } from '@app/common/interfaces';
import { Role } from '@app/common/types';
import { Type } from 'class-transformer';

export class UserDto implements IUser {
	@ApiProperty()
	@IsString()
	_id: string;

	@ApiProperty({ enum: Role })
	@IsEnum(Role)
	role: Role;

	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsString()
	passwordHash: string;

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	userName?: string;

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	image?: string;

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	refreshTokenHash?: string;
}

export class NewUserDto extends IntersectionType(
	OmitType(UserDto, ['_id', 'role', 'passwordHash']),
) {
	@ApiProperty()
	@IsString()
	password: string;
}

export class UserWithoutPasswordDto extends IntersectionType(
	OmitType(UserDto, ['passwordHash', 'refreshTokenHash']),
) {}

export class EditableUserDto extends IntersectionType(
	PickType(UserDto, ['_id']),
	PartialType(OmitType(UserDto, ['_id', 'passwordHash'])),
) {}

export class WrappedUserDto {
	@ApiProperty({ type: UserWithoutPasswordDto })
	@IsObject()
	@Type(() => UserWithoutPasswordDto)
	user: UserWithoutPasswordDto;
}

export class WrappedUsersDto {
	@ApiProperty({ type: [UserWithoutPasswordDto] })
	@IsArray()
	@Type(() => UserWithoutPasswordDto)
	users: UserWithoutPasswordDto[];
}
