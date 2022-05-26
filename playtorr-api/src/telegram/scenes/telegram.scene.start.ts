import { Scenes } from 'telegraf';
import {
	AUTH_BTN,
	SOME_ERROR,
	TO_MAIN_BTN,
	ADD_MOVIE_MENU,
	AUTH_LOGIN_MENU,
	PLEASE_USE_MENU_PROMPT,
} from '../telegram.constants';

export function genStartScene() {
	// Start scene
	const startScene = new Scenes.BaseScene<Scenes.SceneContext>('startScene');
	const sceneButtons = [[AUTH_LOGIN_MENU, ADD_MOVIE_MENU]];
	const start = (
		ctx: Scenes.SceneContext<Scenes.SceneSessionData>,
		message?: string,
	) => this.buildMenu(sceneButtons, ctx, message);

	startScene.enter(async (ctx) => start(ctx));
	startScene.start(async (ctx) => start(ctx));
	startScene.hears(TO_MAIN_BTN, async (ctx) => start(ctx));
	startScene.hears(AUTH_BTN, async (ctx) => start(ctx, SOME_ERROR));
	startScene.hears(AUTH_LOGIN_MENU, this.enter('authScene'));
	startScene.hears(ADD_MOVIE_MENU, this.enter('addMovieScene'));
	startScene.on('message', async (ctx) => ctx.reply(PLEASE_USE_MENU_PROMPT));

	return startScene;
}
