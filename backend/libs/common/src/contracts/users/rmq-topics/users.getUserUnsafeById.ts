import { IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../dtos';

export namespace UsersGetUserUnsafeById {
	export const topic = 'users.getUserUnsafeById.command';

	export class Request {
		@ApiProperty()
		@IsString()
		id: string;
	}

	export class Response {
		@ApiProperty({ type: UserDto })
		@Type(() => UserDto)
		user: UserDto;
	}
}
