import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RedefinedLoggerService } from './logger.service';
import { objectToSplitString } from '@app/common';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
	constructor(private readonly logger: RedefinedLoggerService) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		if (context.getType() === 'http') {
			return this.logHttpCall(context, next);
		}
	}

	private logHttpCall(context: ExecutionContext, next: CallHandler) {
		const request = context.switchToHttp().getRequest();
		const userAgent = request.get('user-agent') || '';
		const now = Date.now();
		const { ip, method, path: url } = request;
		const correlationKey = uuidv4();
		const userId = request.user?.email;

		this.logger.log(
			objectToSplitString({
				correlationKey,
				method,
				url,
				userId,
				userAgent,
				ip,
				class: context.getClass().name,
				handle: context.getHandler().name,
			}),
		);

		return next.handle().pipe(
			tap(() => {
				const response = context.switchToHttp().getResponse();
				const { statusCode } = response;
				const contentLength = response.get('content-length');

				this.logger.log({
					correlationKey,
					method,
					url,
					statusCode,
					contentLength,
					time: `${Date.now() - now}ms`,
				});
			}),
		);
	}
}

export const AppInterceptor = {
	provide: APP_INTERCEPTOR,
	useClass: LoggerInterceptor,
};
