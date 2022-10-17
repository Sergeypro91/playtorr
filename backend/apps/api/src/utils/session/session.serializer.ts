import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { AuthRegister } from '@app/contracts';

@Injectable()
export class SessionSerializer extends PassportSerializer {
	constructor() {
		super();
	}

	serializeUser(
		user: Pick<AuthRegister.Request, 'email' | 'tgId' | 'role'>,
		done: (
			error: null | Error,
			user: Pick<AuthRegister.Request, 'email' | 'tgId' | 'role'>,
		) => void,
	) {
		done(null, user);
	}

	async deserializeUser(
		payload: Pick<AuthRegister.Request, 'email' | 'tgId' | 'role'>,
		done: (
			error: null | Error,
			payload: Pick<AuthRegister.Request, 'email' | 'tgId' | 'role'>,
		) => void,
	) {
		return done(null, payload);
	}
}
