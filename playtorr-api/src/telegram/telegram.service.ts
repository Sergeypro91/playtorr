import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Telegraf, Markup } from 'telegraf';
import {
	MyBotTelegramOptions,
	MyTelegramBotMessageType,
} from './telegram.interface';
import {
	ADD_MOVIE_MENU,
	AUTH_BTN,
	AUTH_LOGIN_MENU,
	BACK_BTN,
	CONGRATS_STICKER,
	SOME_ERROR_HAPPENS,
	SORRY_STICKER,
	TELEGRAM_MODULE_OPTIONS,
	TELEGRAM_REDIRECT_URL,
	TO_MAIN_BTN,
} from './telegram.constants';
import { TelegramUserDto } from './dto/telegram.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class TelegramService {
	bot: Telegraf;
	options: MyBotTelegramOptions;

	constructor(
		@Inject(TELEGRAM_MODULE_OPTIONS) options: MyBotTelegramOptions,
		private readonly authService: AuthService,
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

	loginBtn = Markup.inlineKeyboard([
		Markup.button.login(AUTH_BTN, TELEGRAM_REDIRECT_URL, {
			bot_username: 'PlayTorrBot',
			request_write_access: true,
		}),
	]);

	startBot() {
		this.bot.start(async (ctx) => {
			return await ctx.reply(
				'Для работы с ботом воспользуйтесь "Меню" ниже.',
				Markup.keyboard([
					[AUTH_LOGIN_MENU, ADD_MOVIE_MENU],
					[BACK_BTN, TO_MAIN_BTN],
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
		this.bot.hears(AUTH_LOGIN_MENU, async (ctx) => {
			const userInfo = ctx.update.message.from;
			const userImage = await this.getUserImageUrl(userInfo.id);

			console.log('USER DATA', { userInfo, userImage });

			const user = await this.authService.findUserByTgId(
				`${userInfo.id}`,
			);

			if (!user) {
				console.log('USER DIDNT FOUND');
				try {
					await ctx.reply('👇🏼', this.loginBtn);
				} catch (err) {
					await this.bot.telegram.sendSticker(
						`${userInfo.id}`,
						SORRY_STICKER,
					);
					ctx.reply(SOME_ERROR_HAPPENS);
					console.log(
						'\x1b[30m\x1b[43m%s\x1b[0m',
						'Handled Error',
						err,
					);
				}
			}
		});
	}

	addMovie() {
		this.bot.hears(ADD_MOVIE_MENU, async (ctx) =>
			ctx.reply('Данный функционал в разработке, попробуйте позже!'),
		);
	}

	back() {
		this.bot.hears(BACK_BTN, async (ctx) =>
			ctx.reply('Данный функционал в разработке, попробуйте позже!'),
		);
	}

	toMainMenu() {
		this.bot.hears(TO_MAIN_BTN, async (ctx) =>
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
		userInfo?: TelegramUserDto,
	) {
		try {
			const messageBuilder = `${message}${
				userInfo
					? ` ${
							userInfo.username
								? userInfo.username
								: `${userInfo.first_name} ${
										userInfo.last_name
											? userInfo.last_name
											: ''
								  }`
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
		} catch (err) {
			throw new BadRequestException(err.response.description, err);
		}
	}

	async getUserImageUrl(userId: number) {
		return this.bot.telegram
			.getUserProfilePhotos(userId, 0, 1)
			.then(async (data) => {
				const fileId = data.photos[0][0].file_id;
				const { href } = await this.bot.telegram.getFileLink(fileId);
				return href;
			});
	}
}
