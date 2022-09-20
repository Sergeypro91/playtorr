import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from '../../user/user.service';
import { User } from '../../user/User';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(
    user: Pick<User, 'email' | 'tgId' | 'role'>,
    done: (
      err: null | Error,
      user: Pick<User, 'email' | 'tgId' | 'role'>,
    ) => void,
  ) {
    done(null, user);
  }

  async deserializeUser(
    payload: Pick<User, 'email' | 'tgId' | 'role'>,
    done: (
      err: null | Error,
      payload: Pick<User, 'email' | 'tgId' | 'role'>,
    ) => void,
  ) {
    return done(null, payload);
  }
}
