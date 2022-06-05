import { IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { UserDto } from '../../auth/dto/userDto';

export class EditUserDto {
	@IsString()
	editUserEmail: string;

	@Type(() => UserDto)
	editUserData: Partial<UserDto>;
}

export class DeleteUserDto {
	@IsString()
	editUserEmail: string;
}
