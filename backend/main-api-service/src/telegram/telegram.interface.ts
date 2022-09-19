import { ModuleMetadata } from "@nestjs/common";
import { Role } from "../user/user.model";

export interface MyBotTelegramOptions {
  chatId: string;
  token: string;
}

export interface MyBotTelegramModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  useFactory: (
    ...args: any[]
  ) => Promise<MyBotTelegramOptions> | MyBotTelegramOptions;
  inject?: any[];
}

export interface User {
  tgId: number;
  email: string;
  role?: Role;
  image?: string;
  password: string;
  nickname?: string;
  lastName?: string;
  firstName?: string;
}
