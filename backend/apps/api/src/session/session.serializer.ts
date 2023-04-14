import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserDto } from '@app/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {
	constructor() {
		super();
	}

	serializeUser(
		user: Pick<UserDto, 'email' | 'tgId' | 'role'>,
		done: (
			error: null | Error,
			user: Pick<UserDto, 'email' | 'tgId' | 'role'>,
		) => void,
	) {
		done(null, user);
	}

	async deserializeUser(
		payload: Pick<UserDto, 'email' | 'tgId' | 'role'>,
		done: (
			error: null | Error,
			payload: Pick<UserDto, 'email' | 'tgId' | 'role'>,
		) => void,
	) {
		return done(null, payload);
	}
}
