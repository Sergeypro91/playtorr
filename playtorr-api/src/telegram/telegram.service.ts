import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Telegraf, Markup } from 'telegraf';
import { User } from 'typegram';
import {
	MyBotTelegramOptions,
	MyTelegramBotMessageType,
} from './telegram.interface';
import {
	CONGRATS_STICKER,
	SOME_ERROR_HAPPENS,
	SORRY_STICKER,
	TELEGRAM_MODULE_OPTIONS,
} from './telegram.constants';

@Injectable()
export class TelegramService {
	bot: Telegraf;
	options: MyBotTelegramOptions;

	constructor(
		@Inject(TELEGRAM_MODULE_OPTIONS) options: MyBotTelegramOptions,
	) {
		this.bot = new Telegraf(options.token);
		this.options = options;

		// this.bot.use(Telegraf.log());

		// Telegram bot functions
		this.startBot();
		this.enter();
		this.addMovie();
		this.back();
		this.toMainMenu();
		this.launchBot();
		this.stopBot();
	}

	startBot() {
		this.bot.start(async (ctx) => {
			return await ctx.reply(
				'Для работы с ботом воспользуйтесь "Меню" ниже.',
				Markup.keyboard([
					['🎟 Войти', '🍿 Добавить фильм'],
					['Назад', 'На главную'],
				])
					.oneTime()
					.resize(),
			);
		});
	}

	launchBot() {
		this.bot
			.launch()
			.then(() => {
				console.log(
					'\x1b[30m\x1b[42m%s\x1b[0m',
					'Telegram Bot is started!',
				);
			})
			.catch((err) => {
				throw err;
			});
	}

	enter() {
		this.bot.hears('🎟 Войти', async (ctx) => {
			const userInfo = ctx.update.message.from;

			console.log('USER INFO', userInfo);

			try {
				await this.sendMessage(
					'enter',
					'Вы вошли как',
					`${userInfo.id}`,
					userInfo,
				);
			} catch (err) {
				await this.bot.telegram.sendSticker(
					`${userInfo.id}`,
					SORRY_STICKER,
				);
				ctx.reply(SOME_ERROR_HAPPENS);
			}
		});
	}

	addMovie() {
		this.bot.hears('🍿 Добавить фильм', async (ctx) =>
			ctx.reply('Данный функционал в разработке, попробуйте позже!'),
		);
	}

	back() {
		this.bot.hears('Назад', async (ctx) =>
			ctx.reply('Данный функционал в разработке, попробуйте позже!'),
		);
	}

	toMainMenu() {
		this.bot.hears('На главную', async (ctx) =>
			ctx.reply('Данный функционал в разработке, попробуйте позже!'),
		);
	}

	stopBot() {
		// Enable graceful stop
		process.once('SIGINT', () => this.bot.stop('SIGINT'));
		process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
		console.log('\x1b[30m\x1b[41m%s\x1b[0m', 'Telegram Bot is stopped!');
	}

	async sendMessage(
		type: MyTelegramBotMessageType,
		message: string,
		chatId: string = this.options.chatId,
		userInfo?: User,
	) {
		try {
			const messageBuilder = `${message}${
				userInfo
					? ` ${
							userInfo.username
								? userInfo.username
								: `${userInfo.first_name} ${userInfo.last_name}`
					  }`
					: ''
			}`;

			if (type === 'enter') {
				await this.bot.telegram.sendSticker(
					`${chatId}`,
					CONGRATS_STICKER,
				);
			}

			await this.bot.telegram.sendMessage(chatId, messageBuilder);

			return { status: 200, message: messageBuilder };
		} catch (err) {
			throw new BadRequestException(err.response.description, err);
		}
	}
}
