import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { ParserGetTorrents } from '@app/contracts';
import { ParserService } from './parser.service';

@Controller()
export class ParserController {
	constructor(private readonly parserService: ParserService) {}

	@RMQValidate()
	@RMQRoute(ParserGetTorrents.topic)
	async getTorrents(
		@Body() query: ParserGetTorrents.Request,
	): Promise<ParserGetTorrents.Response[]> {
		return this.parserService.getTorrents(query);
	}
}
