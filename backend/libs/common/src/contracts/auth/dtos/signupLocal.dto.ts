import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupLocalDto {
	@ApiProperty()
	@IsString()
	userName: string;

	@ApiProperty()
	@IsEmail()
	@IsString()
	email: string;

	@ApiProperty()
	@IsString()
	password: string;
}
