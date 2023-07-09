import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { Body, Controller } from '@nestjs/common';
import {
	TmdbSearchTmdb,
	TmdbGetTmdbPerson,
	TmdbGetTmdbPicture,
	TmdbGetTmdbPictureTrends,
	TmdbGetTmdbNetworkPictures,
} from '@app/common/contracts';
import { TmdbService } from './tmdb.service';

@Controller()
export class TmdbController {
	constructor(private readonly tmdbService: TmdbService) {}

	@RMQValidate()
	@RMQRoute(TmdbSearchTmdb.topic)
	public async searchTmdb(
		@Body() dto: TmdbSearchTmdb.Request,
	): Promise<TmdbSearchTmdb.Response> {
		return this.tmdbService.searchTmdb(dto);
	}

	@RMQValidate()
	@RMQRoute(TmdbGetTmdbPerson.topic)
	public async getTmdbPerson(
		@Body() dto: TmdbGetTmdbPerson.Request,
	): Promise<TmdbGetTmdbPerson.Response> {
		return this.tmdbService.getTmdbPerson(dto);
	}

	@RMQValidate()
	@RMQRoute(TmdbGetTmdbPicture.topic)
	public async getTmdbPicture(
		@Body() dto: TmdbGetTmdbPicture.Request,
	): Promise<
		TmdbGetTmdbPicture.ResponseMovie | TmdbGetTmdbPicture.ResponseTv
	> {
		return this.tmdbService.getTmdbPicture(dto);
	}

	@RMQValidate()
	@RMQRoute(TmdbGetTmdbPictureTrends.topic)
	public async getTmdPictureTrends(
		@Body() dto: TmdbGetTmdbPictureTrends.Request,
	): Promise<TmdbGetTmdbPictureTrends.Response> {
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
