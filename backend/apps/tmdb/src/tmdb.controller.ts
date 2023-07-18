import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { Body, Controller } from '@nestjs/common';
import {
	GetTmdbSearch,
	GetTmdbPerson,
	GetTmdbPicture,
	GetTmdbPictureTrends,
	TmdbGetTmdbNetworkPictures,
} from '@app/common/contracts';
import { TmdbService } from './tmdb.service';

@Controller()
export class TmdbController {
	constructor(private readonly tmdbService: TmdbService) {}

	@RMQValidate()
	@RMQRoute(GetTmdbSearch.topic)
	public async searchTmdb(
		@Body() dto: GetTmdbSearch.Request,
	): Promise<GetTmdbSearch.Response> {
		return this.tmdbService.searchTmdb(dto);
	}

	@RMQValidate()
	@RMQRoute(GetTmdbPerson.topic)
	public async getTmdbPerson(
		@Body() dto: GetTmdbPerson.Request,
	): Promise<GetTmdbPerson.Response> {
		return this.tmdbService.getTmdbPerson(dto);
	}

	@RMQValidate()
	@RMQRoute(GetTmdbPicture.topic)
	public async getTmdbPicture(
		@Body() dto: GetTmdbPicture.Request,
	): Promise<GetTmdbPicture.ResponseMovie | GetTmdbPicture.ResponseTv> {
		return this.tmdbService.getTmdbPicture(dto);
	}

	@RMQValidate()
	@RMQRoute(GetTmdbPictureTrends.topic)
	public async getTmdPictureTrends(
		@Body() dto: GetTmdbPictureTrends.Request,
	): Promise<GetTmdbPictureTrends.Response> {
		return this.tmdbService.getTmdPictureTrends(dto);
	}

	@RMQValidate()
	@RMQRoute(TmdbGetTmdbNetworkPictures.topic)
	public async getTmdbNetworkPictures(
		@Body() dto: TmdbGetTmdbNetworkPictures.Request,
	): Promise<TmdbGetTmdbNetworkPictures.Response> {
		return this.tmdbService.getTmdbNetworkPictures(dto);
	}
}
