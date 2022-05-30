import {
	Logger,
	Inject,
	Injectable,
	BadRequestException,
} from '@nestjs/common';
import { Markup, Scenes, session, Telegraf } from 'telegraf';
import { MyBotTelegramOptions, User } from './telegram.interface';
import {
	START_PROMPT,
	SORRY_STICKER,
	CONGRATS_PROMPT,
	CONGRATS_STICKER,
	SOME_ERROR_HAPPENS,
	TELEGRAM_MODULE_OPTIONS,
} from './telegram.constants';
import { UserService } from '../user/user.service';
import { AuthService } from '../auth/auth.service';
import { genStartScene } from './scenes/telegram.scene.start';
import { genAuthScene } from './scenes/telegram.scene.auth';
import { genAddMovieScene } from './scenes/telegram.scene.addMovie';
import { genAuthWizard } from './wizard/telegram.wizard.auth';

@Injectable()
export class TelegramService {
	bot: Telegraf<Scenes.SceneContext>;
	options: MyBotTelegramOptions;
	logger: Logger;
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
		private readonly userService: UserService,
		private readonly authService: AuthService,
	) {
		this.bot = new Telegraf<Scenes.SceneContext>(options.token);
		this.options = options;
		this.logger = new Logger('TelegramBot');
		this.startScene = genStartScene.bind(this)();
		this.authScene = genAuthScene.bind(this)();
		this.addMovieScene = genAddMovieScene.bind(this)();
		this.authWizard = genAuthWizard.bind(this)();

		const stage = new Scenes.Stage<Scenes.SceneContext>(
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
		this.bot.use(stage.middleware());
		this.launchBot();
		this.startBot();
		this.stopBot();
	}

	launchBot() {
		this.bot
			.launch()
			.then(() => {
				this.logger.log('Telegram Bot is started');
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
		this.logger.warn('Telegram Bot is stopped');
	}

	async sendSticker(sticker: string, chatId: string = this.options.chatId) {
		try {
			await this.bot.telegram.sendSticker(`${chatId}`, sticker);
		} catch (err) {
			throw new BadRequestException(err.response.description, err);
		}
	}

	async getUserImageUrl(tgUserId: number) {
		let userImage = '';

		try {
			userImage = await this.bot.telegram
				.getUserProfilePhotos(tgUserId, 0, 1)
				.then(async (data) => {
					const fileId = data.photos[0][0].file_id;
					const { href } = await this.bot.telegram.getFileLink(
						fileId,
					);
					return href;
				});
		} catch (err) {
			throw new BadRequestException(err.response.description, err);
		}

		return userImage;
	}

	async buildMenu(
		buttons: string[][],
		ctx: Scenes.SceneContext<Scenes.SceneSessionData>,
		message?: string,
	) {
		await ctx.reply(
			message || START_PROMPT,
			Markup.keyboard(buttons).oneTime().resize(),
		);
	}

	async secureMessage(ctx: Scenes.SceneContext<Scenes.SceneSessionData>) {
		if (ctx.from && ctx.message) {
			try {
				await this.bot.telegram.deleteMessage(
					ctx.from.id,
					ctx.message.message_id,
				);
				await ctx.reply('******');
			} catch (err) {
				throw new BadRequestException(err.response.description, err);
			}
		}
	}

	async authNewUser(
		ctx: Scenes.SceneContext<Scenes.SceneSessionData>,
		user: User,
	) {
		try {
			await this.authService.createUser(user);
			await this.sendSticker(CONGRATS_STICKER);
			await ctx.reply(CONGRATS_PROMPT);
			this.logger.log(
				'New user' +
					(user?.nickname
						? `: ${user.nickname} - `
						: `: ${user.tgId} - `) +
					'added to DB',
			);
		} catch (err) {
			await this.sendSticker(SORRY_STICKER);
			await ctx.reply(SOME_ERROR_HAPPENS);
			throw new BadRequestException(err.response.description, err);
		}
	}
}
