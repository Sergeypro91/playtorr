import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const getJWTConfig = async (
  configService: ConfigService,
): Promise<JwtModuleOptions> => {
  const JWT_SECRET = configService.get('JWT_SECRET');
  const JWT_TTL = configService.get('JWT_TTL');

  return {
    secret: JWT_SECRET,
    signOptions: { expiresIn: `${JWT_TTL}s` },
  };
};
