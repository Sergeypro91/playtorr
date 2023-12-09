import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshToken {
	@ApiProperty()
	@IsString()
	refreshToken: string;
}
