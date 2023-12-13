import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthRefreshTokenDto {
	@ApiProperty()
	@IsString()
	userId: string;

	@ApiProperty()
	@IsString()
	refreshToken: string;
}
