import { Body, Controller } from '@nestjs/common';
import { PictureService } from './picture.service';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { PictureGetPictureData } from '@app/contracts/picture';

@Controller()
export class PictureController {
	constructor(private readonly pictureService: PictureService) {}

	@RMQValidate()
	@RMQRoute(PictureGetPictureData.topic)
	async getPictureData(
		@Body() queryDto: PictureGetPictureData.Request,
	): Promise<PictureGetPictureData.Response> {
		return this.pictureService.getPictureData(queryDto);
	}
}
