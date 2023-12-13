import { compare, genSalt, hash } from 'bcryptjs';
import { RMQError, RMQService } from 'nestjs-rmq';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
	TokensDto,
	SigninLocalDto,
	SignupLocalDto,
	UserWithoutPasswordDto,
	UsersEditUser,
	UsersCreateUser,
	UsersFindUserById,
	UsersGetUserUnsafeById,
	UsersGetUserUnsafeByEmail,
	AuthRefreshTokenDto,
	GoogleUserDto,
} from '@app/common/contracts';
import {
	ApiError,
	WRONG_PASSWORD_ERROR,
	WRONG_CREDENTIALS_ERROR,
	FORBIDDEN_ERROR,
} from '@app/common/constants';
import { JWTPayload } from '@app/common/types';

@Injectable()
export class AuthService {
	logger: Logger;

	constructor(
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
		private readonly rmqService: RMQService,
	) {
		this.logger = new Logger(AuthService.name);
	}

	public async signupLocal(newUser: SignupLocalDto) {
		const user = await this.rmqService.send<
			UsersCreateUser.Request,
			UsersCreateUser.Response
		>(UsersCreateUser.topic, newUser);

		return `User "${user.userName}" - was created, confirmation send on your email`;
	}

	public async signinLocal({
		email,
		password,
	}: SigninLocalDto): Promise<TokensDto> {
		const { user } = await this.rmqService.send<
			UsersGetUserUnsafeByEmail.Request,
			UsersGetUserUnsafeByEmail.Response
		>(UsersGetUserUnsafeByEmail.topic, { email });

		if (!user) {
			throw new ApiError(
				HttpStatus.UNAUTHORIZED,
				WRONG_CREDENTIALS_ERROR,
			);
		}

		const isCorrectPassword = await compare(password, user.passwordHash);

		if (!isCorrectPassword) {
			throw new ApiError(HttpStatus.UNAUTHORIZED, WRONG_PASSWORD_ERROR);
		}

		const tokens = await this.generateTokens(user);

		await this.storeRefreshToken(user._id, tokens.refreshToken);

		return tokens;
	}

	public async logout(userId: string): Promise<boolean> {
		const { user } = await this.rmqService.send<
			UsersFindUserById.Request,
			UsersFindUserById.Response
		>(UsersFindUserById.topic, { id: userId });

		if (!user) {
			throw new ApiError(
				HttpStatus.UNAUTHORIZED,
				WRONG_CREDENTIALS_ERROR,
			);
		}

		await this.rmqService.send<
			UsersEditUser.Request,
			UsersEditUser.Response
		>(UsersEditUser.topic, { _id: userId, refreshTokenHash: null });

		return true;
	}

	public async refreshTokens({
		userId,
		refreshToken,
	}: AuthRefreshTokenDto): Promise<TokensDto> {
		const { user } = await this.rmqService.send<
			UsersGetUserUnsafeById.Request,
			UsersGetUserUnsafeById.Response
		>(UsersGetUserUnsafeById.topic, { id: userId });

		if (!user) {
			throw new ApiError(
				HttpStatus.UNAUTHORIZED,
				WRONG_CREDENTIALS_ERROR,
			);
		}

		const isCorrectRefreshToken = await compare(
			refreshToken,
			user.refreshTokenHash,
		);

		if (!isCorrectRefreshToken) {
			throw new ApiError(HttpStatus.FORBIDDEN, FORBIDDEN_ERROR);
		}

		const tokens = await this.generateTokens(user);

		await this.storeRefreshToken(user._id, tokens.refreshToken);

		return tokens;
	}

	public async generateTokens({
		_id,
		email,
		role,
	}: UserWithoutPasswordDto): Promise<TokensDto> {
		const jwtPayload: JWTPayload = {
			sub: _id,
			email,
			role,
		};
		const accessToken = await this.jwtService.signAsync(jwtPayload, {
			expiresIn: `${Math.ceil(
				this.configService.get('JWT_TTL' ?? '20000') / 1000,
			)}s`,
			secret: this.configService.get('JWT_SECRET' ?? ''),
		});
		const refreshToken = await this.jwtService.signAsync(jwtPayload, {
			expiresIn: `${Math.ceil(
				this.configService.get('JWT_REFRESH_TTL' ?? '86400000') / 1000,
			)}s`,
			secret: this.configService.get('JWT_REFRESH_SECRET' ?? ''),
		});

		return { accessToken, refreshToken };
	}

	public async storeRefreshToken(id: string, refreshToken: string) {
		const salt = await genSalt(10);
		const refreshTokenHash = await hash(refreshToken, salt);

		return this.rmqService.send<
			UsersEditUser.Request,
			UsersEditUser.Response
		>(UsersEditUser.topic, { _id: id, refreshTokenHash });
	}

	// GOOGLE
	public async googleAuth(googleUser: GoogleUserDto): Promise<TokensDto> {
		let { user } = await this.rmqService.send<
			UsersGetUserUnsafeByEmail.Request,
			UsersGetUserUnsafeByEmail.Response
		>(UsersGetUserUnsafeByEmail.topic, { email: googleUser.email });

		if (!user) {
			const password = Math.random().toString(36).slice(-8);
			user = await this.rmqService.send<
				UsersCreateUser.Request,
				UsersCreateUser.Response
			>(UsersCreateUser.topic, { ...googleUser, password });
		}

		const tokens = await this.generateTokens(user);
		await this.storeRefreshToken(user._id, tokens.refreshToken);

		return tokens;
	}
}
