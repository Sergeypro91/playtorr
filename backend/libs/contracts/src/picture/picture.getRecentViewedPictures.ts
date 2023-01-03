import { PictureDataDto, UserDto } from '@app/contracts';
import { PickType } from '@nestjs/swagger';

export namespace PictureGetRecentViewedPictures {
	export const topic = 'picture.getRecentViewedPictures.command';

	export class Request extends PickType(UserDto, ['email']) {}

	export class Response extends PictureDataDto {}
}
