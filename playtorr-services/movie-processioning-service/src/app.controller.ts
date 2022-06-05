import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
	Ctx,
	Payload,
	RedisContext,
	EventPattern,
	MessagePattern,
} from '@nestjs/microservices';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	getHello(): string {
		return this.appService.getHello();
	}

	@EventPattern('count_number')
	handleCountNumberEvent(data: number[]) {
		this.appService.handleCountNumberEvent(data);
	}

	@MessagePattern('handling_number_count')
	handleCountNumberMessage(
		@Payload() data: number[],
		@Ctx() context: RedisContext,
	) {
		return this.appService.handleCountNumberMessage(data);
	}
}
