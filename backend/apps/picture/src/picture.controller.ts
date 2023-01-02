import { Body, Controller } from '@nestjs/common';
import { PictureService } from './picture.service';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import {
	PictureGetPictureData,
	PictureSearchPicture,
} from '@app/contracts/picture';
import { GetPictureTrends } from '@app/contracts/picture/picture.getPictureTrends';

@Controller()
export class PictureController {
	constructor(private readonly pictureService: PictureService) {}

	@RMQValidate()
	@RMQRoute(PictureGetPictureData.topic)
	async getPictureData(
		@Body() query: PictureGetPictureData.Request,
	): Promise<PictureGetPictureData.Response> {
		return this.pictureService.getPictureData(query);
	}

	@RMQValidate()
	@RMQRoute(PictureSearchPicture.topic)
	async searchPicture(
		@Body() query: PictureSearchPicture.Request,
	): Promise<PictureSearchPicture.Response> {
		return this.pictureService.searchPicture(query);
	}

	@RMQValidate()
	@RMQRoute(GetPictureTrends.topic)
	async getPictureTrends(
		@Body() query: GetPictureTrends.Request,
	): Promise<GetPictureTrends.Response> {
		return this.pictureService.getPictureTrends(query);
	}
}
