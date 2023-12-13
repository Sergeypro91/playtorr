import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JWTPayload } from '@app/common/types';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_REFRESH_SECRET,
			passReqToCallback: true,
		});
	}

	validate(req: Request, payload: JWTPayload) {
		const refreshToken = req
			.get('authorization')
			.replace('Bearer', '')
			.trim();
		return { ...payload, refreshToken };
	}
}
