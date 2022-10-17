import { Logger, Injectable, BadRequestException } from '@nestjs/common';
import { Logger as PinoLogger } from 'nestjs-pino';
import { Markup, Scenes, session, Telegraf } from 'telegraf';
import { User } from '@app/interfaces/telegram/telegram.interface';
import {
	START_PROMPT,
	SORRY_STICKER,
	CONGRATS_PROMPT,
	CONGRATS_STICKER,
	SOME_ERROR_HAPPENS,
} from '@app/constants/telegram/telegram.constants';
import { genStartScene } from './scenes/telegram.scene.start';
import { genAuthScene } from './scenes/telegram.scene.auth';
import { genAddMovieScene } from './scenes/telegram.scene.addMovie';
import { genAuthWizard } from './wizard/telegram.wizard.auth';
import { RMQService } from 'nestjs-rmq';
import { AuthRegister, FindUserByDto, UserFindUserBy } from '@app/contracts';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService {
	bot: Telegraf<Scenes.SceneContext>;
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
		private readonly configService: ConfigService,
		private readonly rmqService: RMQService,
		private readonly pinoLogger: PinoLogger,
	) {
		this.bot = new Telegraf<Scenes.SceneContext>(
			this.configService.get('TELEGRAM_BOT_TOKEN'),
		);
		this.logger = new Logger(TelegramService.name);
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
			.catch((error) => {
				throw error;
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

	async sendSticker(
		sticker: string,
		chatId: string = this.configService.get('TELEGRAM_CHAT_ID'),
	) {
		try {
			await this.bot.telegram.sendSticker(`${chatId}`, sticker);
		} catch (error) {
			throw new BadRequestException(error.response.description, error);
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
		} catch (error) {
			throw new BadRequestException(error.response.description, error);
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
			} catch (error) {
				throw new BadRequestException(
					error.response.description,
					error,
				);
			}
		}
	}

	async authNewUser(
		ctx: Scenes.SceneContext<Scenes.SceneSessionData>,
		user: User,
	) {
		try {
			await this.rmqService.send<
				AuthRegister.Request,
				AuthRegister.Response
			>(AuthRegister.topic, user);
			await this.sendSticker(CONGRATS_STICKER);
			await ctx.reply(CONGRATS_PROMPT);
		} catch (error) {
			await this.sendSticker(SORRY_STICKER);
			await ctx.reply(SOME_ERROR_HAPPENS);
			if (error instanceof Error) {
				this.pinoLogger.error(error.message);
			}
		}
	}

	async findUserInDB(query: FindUserByDto) {
		try {
			return await this.rmqService.send<
				UserFindUserBy.Request,
				UserFindUserBy.Response
			>(UserFindUserBy.topic, query);
		} catch (error) {
			if (error instanceof Error) {
				this.pinoLogger.error(error.message);
			}
		}
	}
}
