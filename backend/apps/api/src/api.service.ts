import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { TokensDto } from '@app/common/contracts';

@Injectable()
export class ApiService {
	logger: Logger;

	constructor(private readonly configService: ConfigService) {
		this.logger = new Logger(ApiService.name);
	}

	public setCookies({
		response,
		tokens,
	}: {
		response: Response;
		tokens: TokensDto;
	}) {
		const accessTokenTtl = parseInt(
			this.configService.get('JWT_TTL', '20000'),
			10,
		);
		const refreshTokenTtl = parseInt(
			this.configService.get('JWT_REFRESH_TTL', '86400000'),
			10,
		);

		response.cookie('accessToken', tokens.accessToken, {
			secure: false, // TODO true when using https
			httpOnly: true,
			sameSite: 'strict',
			expires: new Date(Date.now() + accessTokenTtl),
		});
		response.cookie('refreshToken', tokens.refreshToken, {
			secure: false, // TODO true when using https
			httpOnly: true,
			sameSite: 'strict',
			expires: new Date(Date.now() + refreshTokenTtl),
		});
		console.log('ENTER TO API SERVICE 3');
	}
}
