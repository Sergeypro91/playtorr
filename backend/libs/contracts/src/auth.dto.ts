import { IsEmail, IsString } from 'class-validator';
import { PickType } from '@nestjs/swagger';

export class LoginUserDto {
	@IsEmail()
	email: string;

	@IsString()
	password: string;
}

export class LogoutUserDto {
	@IsString()
	message: string;
}

export class UserEmailDto extends PickType(LoginUserDto, ['email']) {}
