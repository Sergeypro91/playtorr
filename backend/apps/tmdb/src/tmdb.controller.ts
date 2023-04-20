import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { Body, Controller } from '@nestjs/common';
import {
	TmdbSearchTmdb,
	TmdbGetTmdbPerson,
	TmdbGetTmdbPicture,
} from '@app/common';
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
	): Promise<TmdbGetTmdbPicture.ResponseA | TmdbGetTmdbPicture.ResponseB> {
		return this.tmdbService.getTmdbPicture(dto);
	}
}
