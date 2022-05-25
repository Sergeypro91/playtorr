import { Markup, Scenes, Telegraf } from 'telegraf';
import { ADD_MOVIE_MENU, TO_MAIN_BTN } from '../telegram.constants';

export function genAuthScene() {
	// Handler factories
	const { enter, leave } = Scenes.Stage;

	// Auth scene
	const authScene = new Scenes.BaseScene<Scenes.SceneContext>('authScene');
	authScene.enter(async (ctx) => {
		const tgUserInfo = ctx.from;

		if (tgUserInfo) {
			const tgUserImage = await this.getUserImageUrl(tgUserInfo.id);

			console.log('USER DATA', { tgUserInfo, tgUserImage });

			const dbUser = await this.authService.findUserByTgId(
				`${tgUserInfo.id}`,
			);

			if (!dbUser) {
				console.log('USER DIDNT FOUND');
			}
		}

		ctx.reply(
			'В данном разделе Вы можете зарегистрироватся, или перейти в учетную запись приложения.',
			Markup.keyboard([[TO_MAIN_BTN, ADD_MOVIE_MENU]])
				.oneTime()
				.resize(),
		);
	});

	authScene.hears(TO_MAIN_BTN, enter<Scenes.SceneContext>('startScene'));
	authScene.hears(
		ADD_MOVIE_MENU,
		enter<Scenes.SceneContext>('addMovieScene'),
	);

	return authScene;
}
