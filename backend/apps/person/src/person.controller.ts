import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { Body, Controller } from '@nestjs/common';
import {
	PictureGetPictureData,
	PictureSearchPicture,
	GetPictureTrends,
	PictureGetRecentViewedPictures,
} from '@app/common';
import { PictureService } from './picture.service';

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
	@RMQRoute(PictureGetRecentViewedPictures.topic)
	async getRecentViewedPictures(
		email,
	): Promise<PictureGetRecentViewedPictures.Response[]> {
		return this.pictureService.getRecentViewedPictures(email);
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
