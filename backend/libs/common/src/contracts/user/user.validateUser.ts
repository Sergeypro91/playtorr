import { DBUserDto } from './user.dto';
import { PickType } from '@nestjs/swagger';

export namespace UserValidateUser {
	export const topic = 'user.validateUser.command';

	export class Request extends PickType(DBUserDto, ['email']) {}

	export class Response extends DBUserDto {}
}
