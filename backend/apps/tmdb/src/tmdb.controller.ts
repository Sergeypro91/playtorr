import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { Body, Controller } from '@nestjs/common';
import { TmdbSearchTmdb, TmdbGetTmdbPersonData } from '@app/common';
import { TmdbService } from './tmdb.service';

@Controller()
export class TmdbController {
	constructor(private readonly tmdbService: TmdbService) {}

	@RMQValidate()
	@RMQRoute(TmdbSearchTmdb.topic)
	public async searchTmdbPicture(
		@Body() dto: TmdbSearchTmdb.Request,
	): Promise<TmdbSearchTmdb.Response> {
		return this.tmdbService.searchTmdb(dto);
	}

	@RMQValidate()
	@RMQRoute(TmdbGetTmdbPersonData.topic)
	public async getTmdbPersonData(
		@Body() dto: TmdbGetTmdbPersonData.Request,
	): Promise<TmdbGetTmdbPersonData.Response> {
		return this.tmdbService.getTmdbPersonData(dto);
	}
}
