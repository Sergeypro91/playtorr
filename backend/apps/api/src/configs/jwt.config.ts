import { ConfigService, registerAs } from '@nestjs/config';
import * as process from 'process';

export default registerAs('jwt', () => {
	return {
		secret: process.env.JWT_SECRET,
		audience: process.env.JWT_AUDIENCE,
		issuer: process.env.JWT_ISSUER,
		accessTokenTtl: parseInt(process.env.JWT_TTL ?? '3600', 10),
	};
});

export class JwtModule {
	constructor(private readonly configService: ConfigService) {}

	config() {
		return registerAs('jwt', () => {
			return {
				secret: this.configService.get('JWT_SECRET'),
				audience: this.configService.get('JWT_AUDIENCE'),
				issuer: this.configService.get('JWT_ISSUER'),
				accessTokenTtl: parseInt(
					this.configService.get('JWT_TTL') ?? '3600',
					10,
				),
			};
		});
	}
}
