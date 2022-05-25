import { Markup, Scenes } from 'telegraf';
import { ADD_MOVIE_MENU, AUTH_LOGIN_MENU } from '../telegram.constants';

export function genStartScene() {
	// Handler factories
	const { enter, leave } = Scenes.Stage;

	// Start scene
	const startScene = new Scenes.BaseScene<Scenes.SceneContext>('startScene');
	startScene.enter(async (ctx) =>
		ctx.reply(
			'Для работы с ботом воспользуйтесь "Меню" ниже.',
			Markup.keyboard([[AUTH_LOGIN_MENU, ADD_MOVIE_MENU]])
				.oneTime()
				.resize(),
		),
	);
	startScene.hears(AUTH_LOGIN_MENU, enter<Scenes.SceneContext>('authScene'));
	startScene.hears(
		ADD_MOVIE_MENU,
		enter<Scenes.SceneContext>('addMovieScene'),
	);

	return startScene;
}
