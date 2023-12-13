import { IsEmail, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../dtos';

export namespace UsersGetUserUnsafeByEmail {
	export const topic = 'users.getUserUnsafeByEmail.command';

	export class Request {
		@ApiProperty()
		@IsEmail()
		@IsString()
		email: string;
	}

	export class Response {
		@ApiProperty({ type: UserDto })
		@Type(() => UserDto)
		user: UserDto;
	}
}
