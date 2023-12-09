import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UsersEmailDto {
	@ApiProperty()
	@IsEmail({}, { each: true })
	users: string[];
}
