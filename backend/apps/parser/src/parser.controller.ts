import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { Body, Controller } from '@nestjs/common';
import {
	ParserGetPictureTorrents,
	ParserParseTorrents,
} from '@app/common/contracts';
import { ParserService } from './parser.service';

@Controller()
export class ParserController {
	constructor(private readonly parserService: ParserService) {}

	@RMQValidate()
	@RMQRoute(ParserParseTorrents.topic)
	async parseTorrents(
		@Body() dto: ParserParseTorrents.Request,
	): Promise<ParserParseTorrents.Response> {
		return this.parserService.parseTorrents(dto);
	}

	@RMQValidate()
	@RMQRoute(ParserGetPictureTorrents.topic)
	async getPictureTorrents(
		@Body() dto: ParserGetPictureTorrents.Request,
	): Promise<ParserGetPictureTorrents.Response[]> {
		return this.parserService.getPictureTorrents(dto);
	}
}
