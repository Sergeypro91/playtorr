import { PickType } from '@nestjs/swagger';
import { PictureDataDto } from './picture.dto';
import { UserDto } from '../user';

export namespace PictureGetRecentViewedPictures {
	export const topic = 'picture.getRecentViewedPictures.command';

	export class Request extends PickType(UserDto, ['email']) {}

	export class Response extends PictureDataDto {}
}
