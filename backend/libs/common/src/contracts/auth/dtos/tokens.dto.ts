import { IsString } from 'class-validator';
import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';

export class TokensDto {
	@ApiProperty()
	@IsString()
	accessToken: string;

	@ApiProperty()
	@IsString()
	refreshToken: string;
}

export class AccessTokenDto extends IntersectionType(
	PickType(TokensDto, ['accessToken']),
) {}

export class RefreshTokenDto extends IntersectionType(
	PickType(TokensDto, ['refreshToken']),
) {}
