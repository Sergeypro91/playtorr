import { RMQError } from 'nestjs-rmq';

/**
 * @description Proxy for RMQError.
 * @param statusCode - Error code number.
 * @param message - Error description message.
 * @return RMQError - Error extends.
 */
export class ApiError extends RMQError {
	constructor(statusCode: number, message: string) {
		super(message, undefined, statusCode, new Date().toISOString());
	}
}
