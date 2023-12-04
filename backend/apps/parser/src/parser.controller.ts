import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { Body, Controller } from '@nestjs/common';
import {
	ParserGetPictureTorrents,
	ParserParsePictureTorrents,
} from '@app/common/contracts';
import { ParserService } from './parser.service';

@Controller()
export class ParserController {
	constructor(private readonly parserService: ParserService) {}

	@RMQValidate()
	@RMQRoute(ParserParsePictureTorrents.topic)
	async parsePictureTorrents(
		@Body() dto: ParserParsePictureTorrents.Request,
	): Promise<ParserParsePictureTorrents.Response> {
		return this.parserService.parsePictureTorrents(dto);
	}

	@RMQValidate()
	@RMQRoute(ParserGetPictureTorrents.topic)
	async getPictureTorrents(
		@Body() dto: ParserGetPictureTorrents.Request,
	): Promise<ParserGetPictureTorrents.Response[]> {
		return this.parserService.getPictureTorrents(dto);
	}
}
