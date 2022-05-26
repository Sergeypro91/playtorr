import { Markup, Scenes } from 'telegraf';
import {
	TO_MAIN_BTN,
	AUTH_LOGIN_MENU,
	PLEASE_USE_MENU_PROMPT,
} from '../telegram.constants';

export function genAddMovieScene() {
	// AddMovie scene
	const addMovieScene = new Scenes.BaseScene<Scenes.SceneContext>(
		'addMovieScene',
	);
	const start = async (ctx: Scenes.SceneContext<Scenes.SceneSessionData>) =>
		ctx.reply(
			'В данном разделе Вы можете добавлять новые Торренты в загрузку.',
			Markup.keyboard([[TO_MAIN_BTN, AUTH_LOGIN_MENU]])
				.oneTime()
				.resize(),
		);

	addMovieScene.enter(start);
	addMovieScene.start(start);
	addMovieScene.hears(TO_MAIN_BTN, this.enter('startScene'));
	addMovieScene.hears(AUTH_LOGIN_MENU, this.enter('authScene'));
	addMovieScene.on('message', async (ctx) =>
		ctx.reply(PLEASE_USE_MENU_PROMPT),
	);

	return addMovieScene;
}
