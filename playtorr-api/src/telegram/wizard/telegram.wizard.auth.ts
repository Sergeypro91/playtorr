import { Composer, Markup, Scenes } from 'telegraf';
import { hash } from 'bcryptjs';

interface MyWizardSession extends Scenes.WizardSessionData {
	// will be available under `ctx.scene.session.myWizardSessionProp`
	wizaedSession: any;
}

const emailValidator = (email: string) =>
	/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

const passwordValidator = (email: string) =>
	/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(email);

type MyContext = Scenes.WizardContext<MyWizardSession>;

export function genAuthWizard() {
	const emailRequest = new Composer<MyContext>();
	emailRequest.on('message', async (ctx) => {
		const tgUserInfo = ctx.from;

		if (tgUserInfo) {
			const tgUserImage = await this.getUserImageUrl(tgUserInfo.id);
			ctx.scene.session.wizaedSession = {
				user: {
					...ctx.from,
					image: tgUserImage,
				},
			};
		}

		await ctx.reply('Укажите почту:');

		return ctx.wizard.next();
	});

	const userNameRequest = new Composer<MyContext>();
	userNameRequest.on('message', async (ctx) => {
		if (ctx.message && 'text' in ctx.message) {
			const { user } = ctx.scene.session.wizaedSession;
			const message = ctx.message.text;

			if (emailValidator(message)) {
				user.email = message;

				await ctx.reply(
					'Укажите свой логин, или воспользуйтесь логином "Телеграма"',
					Markup.inlineKeyboard([
						Markup.button.callback(
							`Логин "Телеграма": ${user.username}`,
							'next',
						),
					]),
				);

				return ctx.wizard.next();
			} else {
				await ctx.reply(
					'Это не похоже на адресс электронной почты. Попробуйте еще раз.',
				);
			}
		}
	});

	const passwordRequest = new Composer<MyContext>();
	passwordRequest.action('next', async (ctx) => {
		await ctx.reply('Укажите пароль:');

		return ctx.wizard.next();
	});
	passwordRequest.on('message', async (ctx) => {
		if (ctx.message && 'text' in ctx.message) {
			const { user } = ctx.scene.session.wizaedSession;
			const message = ctx.message.text;
			user.username = message;
		}

		await ctx.reply('Укажите пароль:');

		return ctx.wizard.next();
	});

	const finalStep = new Composer<MyContext>();
	finalStep.on('message', async (ctx) => {
		if (ctx.message && 'text' in ctx.message) {
			const { user } = ctx.scene.session.wizaedSession;
			const message = ctx.message?.text || '';

			if (passwordValidator(message)) {
				user.password = message;
				const newUser = {
					email: user.email,
					password: user.password,
					nickname: user?.nickname,
					firstName: user.first_name,
					lastName: user?.last_name,
					tgId: user.id,
					image: user?.image,
				};

				try {
					this.authService.createUser(newUser);
				} catch (err) {
					console.log(err);
				}

				await ctx.reply('Ура, Вы зарегистрированны!');

				return ctx.scene.enter('authScene');
			} else {
				await ctx.reply(
					'Пароль не достаточно надежный. Попробуйте еще раз.',
				);
			}
		}
	});

	// Auth wizard
	const genAuthWizard = new Scenes.WizardScene(
		'authWizard',
		emailRequest,
		userNameRequest,
		passwordRequest,
		finalStep,
	);

	return genAuthWizard;
}
