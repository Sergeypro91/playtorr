import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Markup, Scenes, session, Telegraf } from 'telegraf';
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
	PLEASE_USE_MENU_PROMPT,
	SOME_ERROR_HAPPENS,
	SORRY_STICKER,
	TELEGRAM_MODULE_OPTIONS,
	TELEGRAM_REDIRECT_URL,
	TO_MAIN_BTN,
} from './telegram.constants';
import { TelegramUserDto } from './dto/telegram.dto';
import { AuthService } from '../auth/auth.service';
import { BaseBg, BaseFg, loggerBuilder } from '../utils/logerBuilder';
import { genStartScene } from './scenes/telegram.scene.start';
import { genAuthScene } from './scenes/telegram.scene.auth';
import { genAddMovieScene } from './scenes/telegram.scene.addMovie';

@Injectable()
export class TelegramService {
	bot: Telegraf<Scenes.SceneContext>;
	options: MyBotTelegramOptions;
	startScene: Scenes.BaseScene<Scenes.SceneContext<Scenes.SceneSessionData>>;
	authScene: Scenes.BaseScene<Scenes.SceneContext<Scenes.SceneSessionData>>;
	addMovieScene: Scenes.BaseScene<
		Scenes.SceneContext<Scenes.SceneSessionData>
	>;

	constructor(
		@Inject(TELEGRAM_MODULE_OPTIONS) options: MyBotTelegramOptions,
		private readonly authService: AuthService,
	) {
		this.bot = new Telegraf<Scenes.SceneContext>(options.token);
		this.options = options;
		this.startScene = genStartScene.bind(this)();
		this.authScene = genAuthScene.bind(this)();
		this.addMovieScene = genAddMovieScene.bind(this)();

		const stage = new Scenes.Stage<Scenes.SceneContext>(
			[this.startScene, this.authScene, this.addMovieScene],
			{ default: 'startScene' },
		);

		this.bot.use(session());
		this.bot.use(stage.middleware());
		this.launchBot();
		this.startBot();
		this.stopBot();
	}

	launchBot() {
		this.bot
			.launch()
			.then(() => {
				loggerBuilder(
					'Telegram',
					'Telegram Bot is started!',
					BaseFg.GREEN,
					'',
					BaseFg.BLACK,
					BaseBg.GREEN,
				);
			})
			.catch((err) => {
				throw err;
			});
	}

	startBot() {
		this.bot.start(async (ctx) => {
			ctx.scene.enter('startScene');
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

	onMessage() {
		this.bot.on(['message'], (ctx) => {
			const thUserId = ctx.update.message.from.id;
			this.sendMessage(
				'regular_message',
				PLEASE_USE_MENU_PROMPT,
				`${thUserId}`,
			);
		});
	}

	stopBot() {
		// Enable graceful stop
		process.once('SIGINT', () => this.bot.stop('SIGINT'));
		process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
		loggerBuilder(
			'Telegram',
			'Telegram Bot is stopped!',
			BaseFg.RED,
			'',
			BaseFg.BLACK,
			BaseBg.RED,
		);
	}

	async sendMessage(
		type: MyTelegramBotMessageType,
		message: string,
		tgUserId: string = this.options.chatId,
		tgUserInfo?: TelegramUserDto,
	) {
		try {
			const messageBuilder = `${message}${
				tgUserInfo
					? ` ${
							tgUserInfo.username
								? tgUserInfo.username
								: `${tgUserInfo.first_name} ${
										tgUserInfo.last_name
											? tgUserInfo.last_name
											: ''
								  }`
					  }`
					: ''
			}`;

			if (type === 'enter') {
				await this.bot.telegram.sendSticker(
					`${tgUserId}`,
					CONGRATS_STICKER,
				);
			}

			await this.bot.telegram.sendMessage(tgUserId, messageBuilder);
		} catch (err) {
			throw new BadRequestException(err.response.description, err);
		}
	}

	async getUserImageUrl(tgUserId: number) {
		return this.bot.telegram
			.getUserProfilePhotos(tgUserId, 0, 1)
			.then(async (data) => {
				const fileId = data.photos[0][0].file_id;
				const { href } = await this.bot.telegram.getFileLink(fileId);
				return href;
			});
	}
}
