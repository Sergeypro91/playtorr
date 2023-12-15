import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailDto {
	@ApiProperty()
	@IsEmail()
	@IsString()
	to: string;

	@ApiProperty()
	@IsString()
	subject: string;

	@ApiProperty()
	@IsString()
	text: string;
}
