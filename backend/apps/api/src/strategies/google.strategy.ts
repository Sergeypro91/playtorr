import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor() {
		super({
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_CALLBACK,
			scope: ['profile', 'email'],
		});
	}

	authorizationParams(): { [key: string]: string } {
		return {
			access_type: 'offline',
			prompt: 'consent',
		};
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		done: VerifyCallback,
	): Promise<any> {
		const { displayName, emails, photos } = profile;
		const user = {
			email: emails[0].value,
			userName: displayName,
			image: photos[0].value,
			accessToken,
			refreshToken,
		};
		done(null, user);
	}
}
