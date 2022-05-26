import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Markup, Scenes, session, Telegraf } from 'telegraf';
import {
	MyBotTelegramOptions,
	MyTelegramBotMessageType,
} from './telegram.interface';
import {
	ADD_MOVIE_MENU,
	AUTH_LOGIN_MENU,
	CONGRATS_STICKER,
	START_PROMPT,
	TELEGRAM_MODULE_OPTIONS,
} from './telegram.constants';
import { TelegramUserDto } from './dto/telegram.dto';
import { AuthService } from '../auth/auth.service';
import { BaseBg, BaseFg, buildLog } from '../utils/logerBuilder';
import { genStartScene } from './scenes/telegram.scene.start';
import { genAuthScene } from './scenes/telegram.scene.auth';
import { genAddMovieScene } from './scenes/telegram.scene.addMovie';
import { genAuthWizard } from './wizard/telegram.wizard.auth';

@Injectable()
export class TelegramService {
	bot: Telegraf<Scenes.SceneContext>;
	options: MyBotTelegramOptions;
	stage: Scenes.Stage<
		Scenes.SceneContext<Scenes.SceneSessionData>,
		Scenes.SceneSessionData
	>;
	enter: typeof Scenes.Stage.enter;
	leave: typeof Scenes.Stage.leave;
	startScene: Scenes.BaseScene<Scenes.SceneContext<Scenes.SceneSessionData>>;
	authScene: Scenes.BaseScene<Scenes.SceneContext<Scenes.SceneSessionData>>;
	authWizard: Scenes.WizardScene<
		Scenes.WizardContext<Scenes.WizardSessionData>
	>;
	addMovieScene: Scenes.BaseScene<
		Scenes.SceneContext<Scenes.SceneSessionData>
	>;

	constructor(
		@Inject(TELEGRAM_MODULE_OPTIONS) options: MyBotTelegramOptions,
		private readonly authService: AuthService,
	) {
		this.bot = new Telegraf<Scenes.SceneContext>(options.token);
		this.options = options;
		this.enter = Scenes.Stage.enter;
		this.leave = Scenes.Stage.leave;
		this.startScene = genStartScene.bind(this)();
		this.authScene = genAuthScene.bind(this)();
		this.addMovieScene = genAddMovieScene.bind(this)();
		this.authWizard = genAuthWizard.bind(this)();

		this.stage = new Scenes.Stage<Scenes.SceneContext>(
			[
				this.startScene,
				this.authScene,
				this.addMovieScene,
				this.authWizard,
			],
			{
				default: 'startScene',
			},
		);

		this.bot.use(session());
		this.bot.use(this.stage.middleware());
		this.launchBot();
		this.startBot();
		this.stopBot();
	}

	launchBot() {
		this.bot
			.launch()
			.then(() => {
				buildLog(
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
		this.bot.start(async (ctx) => ctx.scene.enter('startScene'));
	}

	stopBot() {
		// Enable graceful stop
		process.once('SIGINT', () => this.bot.stop('SIGINT'));
		process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
		buildLog(
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

	async buildMenu(
		buttons: string[][],
		ctx: Scenes.SceneContext<Scenes.SceneSessionData>,
		message?: string,
	) {
		ctx.reply(
			message || START_PROMPT,
			Markup.keyboard(buttons).oneTime().resize(),
		);
	}
}
