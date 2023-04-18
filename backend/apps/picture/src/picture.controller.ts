import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { Body, Controller } from '@nestjs/common';
import {
	PictureGetPictureData,
	PictureSearch,
	GetPictureTrends,
	PictureGetRecentViewedPictures,
} from '@app/common';
import { PictureService } from './picture.service';

@Controller()
export class PictureController {
	constructor(private readonly pictureService: PictureService) {}

	@RMQValidate()
	@RMQRoute(PictureSearch.topic)
	async search(
		@Body() dto: PictureSearch.Request,
	): Promise<PictureSearch.Response> {
		return this.pictureService.search(dto);
	}

	@RMQValidate()
	@RMQRoute(PictureGetPictureData.topic)
	async getPictureData(
		@Body() dto: PictureGetPictureData.Request,
	): Promise<PictureGetPictureData.Response> {
		return this.pictureService.getPictureData(dto);
	}

	@RMQValidate()
	@RMQRoute(PictureGetRecentViewedPictures.topic)
	async getRecentViewedPictures(
		email,
	): Promise<PictureGetRecentViewedPictures.Response[]> {
		return this.pictureService.getRecentViewedPictures(email);
	}

	@RMQValidate()
	@RMQRoute(GetPictureTrends.topic)
	async getPictureTrends(
		@Body() dto: GetPictureTrends.Request,
	): Promise<GetPictureTrends.Response> {
		return this.pictureService.getPictureTrends(dto);
	}
}
