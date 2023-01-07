import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { PinoLogger } from 'nestjs-pino';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
	constructor(private readonly logger: PinoLogger) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		if (context.getType() === 'http') {
			return this.logHttpCall(context, next);
		}
	}

	private logHttpCall(context: ExecutionContext, next: CallHandler) {
		const request = context.switchToHttp().getRequest();
		const correlationKey = uuidv4();
		const userID = request.user?.email;

		this.logger.assign({ userID, correlationKey });
		this.logger.trace({ userID });

		return next.handle().pipe(
			tap(() => {
				this.logger.trace({ userID });
			}),
		);
	}
}

export const PinoLoggerInterceptor = {
	provide: APP_INTERCEPTOR,
	useClass: LoggerInterceptor,
};
