import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../../user/models/user.model';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor() {
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
