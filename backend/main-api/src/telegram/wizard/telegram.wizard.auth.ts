import { Composer, Scenes } from "telegraf";
import {
  TO_MAIN_BTN,
  EMAIL_REQUEST_PROMPT,
  NOT_VALID_EMAIL_PROMPT,
  PASSWORD_REQUEST_PROMPT,
  NOT_VALID_PASSWORD_PROMPT,
  ADD_MOVIE_MENU,
} from "../telegram.constants";
import { emailValidator, passwordValidator } from "../validators/validators";
import { User } from "../telegram.interface";

interface MyWizardSession extends Scenes.WizardSessionData {
  wizardSession: {
    user: User;
  };
}

type MyContext = Scenes.WizardContext<MyWizardSession>;

export function genAuthWizard() {
  const emailRequest = new Composer<MyContext>();
  emailRequest.on("message", async (ctx) => {
    const tgUserInfo = {
      tgId: ctx.from.id,
      email: "",
      password: "",
      nickname: ctx.from?.username,
      firstName: ctx.from?.first_name,
      lastName: ctx.from?.last_name,
    };

    if (tgUserInfo) {
      const tgUserImage = await this.getUserImageUrl(tgUserInfo.tgId);
      ctx.scene.session.wizardSession = {
        user: { ...tgUserInfo, image: tgUserImage },
      };
    }

    await ctx.reply(EMAIL_REQUEST_PROMPT);

    return ctx.wizard.next();
  });

  const passwordRequest = new Composer<MyContext>();
  passwordRequest.on("message", async (ctx) => {
    if (ctx.message && "text" in ctx.message) {
      const message = ctx.message.text;

      if (emailValidator(message)) {
        ctx.scene.session.wizardSession.user.email = message;

        await ctx.reply(PASSWORD_REQUEST_PROMPT);

        return ctx.wizard.next();
      } else {
        await ctx.reply(NOT_VALID_EMAIL_PROMPT);
      }
    }
  });

  const finalStep = new Composer<MyContext>();
  finalStep.on("message", async (ctx) => {
    if (ctx.message && "text" in ctx.message) {
      const { user } = ctx.scene.session.wizardSession;
      const message = ctx.message?.text || "";

      await this.secureMessage(ctx);

      if (passwordValidator(message)) {
        user.password = message;

        await this.authNewUser(ctx, user);

        return await ctx.scene.enter("authScene");
      } else {
        await ctx.reply(NOT_VALID_PASSWORD_PROMPT);
      }
    }
  });

  // Auth wizard
  const genAuthWizard = new Scenes.WizardScene(
    "authWizard",
    emailRequest,
    passwordRequest,
    finalStep
  );

  genAuthWizard.hears(TO_MAIN_BTN, (ctx) => {
    ctx.scene.enter("startScene");
  });

  genAuthWizard.hears(ADD_MOVIE_MENU, (ctx) => {
    ctx.scene.enter("addMovieScene");
  });

  return genAuthWizard;
}
