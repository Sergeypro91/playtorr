import { prop } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export enum Role {
  ADMIN = "admin",
  GUEST = "guest",
  MEMBER = "member",
  PREMIUM = "premium",
  BLOCKED = "blocked",
}

export type UserModel = Base;
export class UserModel extends TimeStamps {
  @prop({ unique: true })
  email: string;

  @prop()
  passwordHash: string;

  @prop()
  nickname?: string;

  @prop()
  firstName?: string;

  @prop()
  lastName?: string;

  @prop()
  tgId?: number;

  @prop({ enum: Role, default: Role.GUEST })
  role: Role;

  @prop()
  image?: string;
}
