import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class GoogleUserDto {
	@ApiProperty()
	@IsEmail()
	@IsString()
	email: string;

	@ApiProperty()
	@IsString()
	userName: string;

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	picture: null | string;

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	accessToken: null | string;

	@ApiProperty({ nullable: true })
	@IsOptional()
	@IsString()
	refreshToken: null | string;
}
