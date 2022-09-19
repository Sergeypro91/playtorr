import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { UserService } from "../../user/user.service";
import { UserModel } from "../../user/user.model";

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(
    user: Pick<UserModel, "email" | "tgId" | "role">,
    done: (
      err: null | Error,
      user: Pick<UserModel, "email" | "tgId" | "role">
    ) => void
  ) {
    done(null, user);
  }

  async deserializeUser(
    payload: Pick<UserModel, "email" | "tgId" | "role">,
    done: (
      err: null | Error,
      payload: Pick<UserModel, "email" | "tgId" | "role">
    ) => void
  ) {
    return done(null, payload);
  }
}
