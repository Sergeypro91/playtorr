import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
	constructor(
		@Inject('COMMUNICATION')
		private readonly communicationClient: ClientProxy,
	) {}

	getHello(): string {
		return 'Hello World!';
	}

	countNumberEvent(numbers: number[]) {
		console.log('Receive data - ', numbers);
		this.communicationClient.emit('count_number', numbers);
	}

	countNumberMessage(numbers: number[]) {
		console.log('MAS Triggering route with data - ', numbers);
		return this.communicationClient.send('count_number_message', numbers);
	}
}
