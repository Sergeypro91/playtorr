import { PickType } from '@nestjs/swagger';
import { PictureDto } from './dtos';
import { UserDto } from '../user';

export namespace PictureGetRecentViewedPictures {
	export const topic = 'picture.getRecentViewedPictures.command';

	export class Request extends PickType(UserDto, ['email']) {}

	export class Response extends PictureDto {}
}
