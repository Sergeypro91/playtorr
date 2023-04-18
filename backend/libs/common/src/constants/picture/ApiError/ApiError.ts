import { RMQError } from 'nestjs-rmq';

export class ApiError extends RMQError {
	constructor(statusCode: number, message: string) {
		super(message, undefined, statusCode, new Date().toISOString());
	}
}
