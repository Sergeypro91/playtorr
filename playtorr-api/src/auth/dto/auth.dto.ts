import { IsString } from 'class-validator';

export class AuthDto {
	@IsString()
	loginName: string;

	@IsString()
	password: string;
}
