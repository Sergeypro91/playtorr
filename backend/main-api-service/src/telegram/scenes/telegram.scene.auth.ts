import { Scenes } from "telegraf";
import {
  AUTH_BTN,
  LOGIN_BTN,
  TO_MAIN_BTN,
  ADD_MOVIE_MENU,
  PLEASE_USE_MENU_PROMPT,
} from "../telegram.constants";

export function genAuthScene() {
  // Auth scene
  const authScene = new Scenes.BaseScene<Scenes.SceneContext>("authScene");
  const sceneButtons = [[ADD_MOVIE_MENU], [TO_MAIN_BTN]];
  const start = async (ctx: Scenes.SceneContext) => {
    const tgUserInfo = ctx.from;

    if (tgUserInfo) {
      const dbUser = await this.userService.findUserByTgId(tgUserInfo.id);

      if (!dbUser) {
        if (sceneButtons[0].length >= 2) {
          sceneButtons[0].splice(0, 1, AUTH_BTN);
        } else {
          sceneButtons[0].unshift(AUTH_BTN);
        }
      } else {
        if (sceneButtons[0].length >= 2) {
          sceneButtons[0].splice(0, 1, LOGIN_BTN);
        } else {
          sceneButtons[0].unshift(LOGIN_BTN);
        }
      }
    }

    this.bot.session = { ...this.bot.session, tgUser: { name: "test" } };

    return this.buildMenu(sceneButtons, ctx);
  };

  authScene.enter(start);
  authScene.start(start);
  authScene.hears(AUTH_BTN, async (ctx) => await ctx.scene.enter("authWizard"));
  authScene.hears(
    TO_MAIN_BTN,
    async (ctx) => await ctx.scene.enter("startScene")
  );
  authScene.hears(
    ADD_MOVIE_MENU,
    async (ctx) => await ctx.scene.enter("addMovieScene")
  );
  authScene.on(
    "message",
    async (ctx) => await ctx.reply(PLEASE_USE_MENU_PROMPT)
  );

  return authScene;
}
