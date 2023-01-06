import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { Body, Controller } from '@nestjs/common';
import { ParserGetPictureTorrents, ParserParseTorrents } from '@app/common';
import { ParserService } from './parser.service';

@Controller()
export class ParserController {
	constructor(private readonly parserService: ParserService) {}

	@RMQValidate()
	@RMQRoute(ParserParseTorrents.topic)
	async parseTorrents(
		@Body() query: ParserParseTorrents.Request,
	): Promise<ParserParseTorrents.Response> {
		return this.parserService.parseTorrents(query);
	}

	@RMQValidate()
	@RMQRoute(ParserGetPictureTorrents.topic)
	async getPictureTorrents(
		@Body() query: ParserGetPictureTorrents.Request,
	): Promise<ParserGetPictureTorrents.Response[]> {
		return this.parserService.getPictureTorrents(query);
	}
}
