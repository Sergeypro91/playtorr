import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from '@app/configs';
import { ParserController } from './parser.controller';
import { ParserService } from './parser.service';

@Module({
	controllers: [ParserController],
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['../envs/.env', './apps/parser/envs/.env'],
		}),
		RMQModule.forRootAsync(getRMQConfig()),
	],
	providers: [ParserService],
})
export class ParserModule {}
