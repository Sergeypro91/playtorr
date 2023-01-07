import { Module } from '@nestjs/common';
import { RedefinedLoggerService } from './logger.service';
import { AppInterceptor } from './logger.interceptor';

@Module({
	providers: [AppInterceptor, RedefinedLoggerService],
})
export class LoggerModule {}
