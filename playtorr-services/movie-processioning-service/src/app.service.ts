import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	getHello(): string {
		return 'Hello World!';
	}

	handleCountNumberEvent(numbers: number[]) {
		console.log('Receive data - ', numbers);
		const answer = numbers.reduce((acc, curr) => acc + curr, 0);
		console.log(`RESULT - ${answer}`);
	}

	handleCountNumberMessage(numbers: number[]) {
		console.log('MPS Receive data - ', numbers);
		return numbers.reduce((acc, curr) => acc + curr, 0);
	}
}
