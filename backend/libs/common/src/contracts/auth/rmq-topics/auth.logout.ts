import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export namespace AuthLogout {
	export const topic = 'auth.logout.command';

	export class Request {
		@ApiProperty()
		@IsString()
		userId: string;
	}
}
