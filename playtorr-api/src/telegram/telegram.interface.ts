import { ModuleMetadata } from '@nestjs/common';

export type MyTelegramBotMessageType =
	| 'enter'
	| 'regular_message'
	| 'warning'
	| 'error';

export interface MyBotTelegramOptions {
	chatId: string;
	token: string;
}

export interface MyBotTelegramModuleAsyncOptions
	extends Pick<ModuleMetadata, 'imports'> {
	useFactory: (
		...args: any[]
	) => Promise<MyBotTelegramOptions> | MyBotTelegramOptions;
	inject?: any[];
}
