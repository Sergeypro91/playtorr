import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from '../../user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
	constructor(private readonly userService: UserService) {
		super();
	}

	serializeUser(
		user: any,
		done: (err: null | Error, user: any) => void,
	): any {
		done(null, user);
	}

	async deserializeUser(
		payload: any,
		done: (err: null | Error, payload: any) => void,
	) {
		return done(null, payload);
	}
}
