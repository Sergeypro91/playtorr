import { Markup, Scenes } from 'telegraf';
import { AUTH_LOGIN_MENU, TO_MAIN_BTN } from '../telegram.constants';

export function genAddMovieScene() {
	// Handler factories
	const { enter, leave } = Scenes.Stage;

	// Start scene
	const addMovieScene = new Scenes.BaseScene<Scenes.SceneContext>(
		'addMovieScene',
	);
	addMovieScene.enter(async (ctx) =>
		ctx.reply(
			'В данном разделе Вы можете добавлять новые Торренты в загрузку.',
			Markup.keyboard([[TO_MAIN_BTN, AUTH_LOGIN_MENU]])
				.oneTime()
				.resize(),
		),
	);

	addMovieScene.hears(TO_MAIN_BTN, enter<Scenes.SceneContext>('startScene'));
	addMovieScene.hears(
		AUTH_LOGIN_MENU,
		enter<Scenes.SceneContext>('authScene'),
	);

	return addMovieScene;
}
