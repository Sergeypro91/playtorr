import { compare, genSalt, hash } from 'bcryptjs';
import { RMQService } from 'nestjs-rmq';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
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
	NewUserDto,
	MailerSendEmail,
	ActivationDto,
	UserDto,
} from '@app/common/contracts';
import {
	ApiError,
	FORBIDDEN_ERROR,
	WRONG_PASSWORD_ERROR,
	SIGNUP_CONFIRM_ERROR,
	WRONG_CREDENTIALS_ERROR,
	SIGNUP_EXPIRED_ERROR,
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

	public async createActivationToken(
		newUser: NewUserDto,
	): Promise<ActivationDto> {
		const activationCode = Math.floor(
			1000 + Math.random() * 9000,
		).toString();
		const activationToken = this.jwtService.sign(
			{
				newUser,
				activationCode,
			},
			{
				secret: this.configService.get('ACTIVATION_SECRET'),
				expiresIn: '5m',
			},
		);

		return { activationToken, activationCode };
	}

	public async signupLocal(newUser: SignupLocalDto): Promise<string> {
		const activationData = await this.createActivationToken(newUser);
		await this.rmqService.send<MailerSendEmail.Request, Promise<true>>(
			MailerSendEmail.topic,
			{
				to: newUser.email,
				subject: 'Tor - confirmation Email',
				text: `Greetings. To register in the application, you were sent a confirmation code - ${activationData.activationCode}. If you have not registered in "Tor" application, simply ignore this message.`,
			},
		);

		return activationData.activationToken;
	}

	public async signupConfirmation({
		activationToken,
		activationCode,
	}: ActivationDto): Promise<TokensDto> {
		let activationData: { newUser: NewUserDto; activationCode: string };

		try {
			activationData = this.jwtService.verify(activationToken, {
				secret: this.configService.get('ACTIVATION_SECRET'),
			});
		} catch (error) {
			throw new ApiError(HttpStatus.UNAUTHORIZED, SIGNUP_EXPIRED_ERROR);
		}

		if (
			activationData.newUser &&
			activationData.activationCode === activationCode
		) {
			const user = await this.rmqService.send<
				UsersCreateUser.Request,
				UsersCreateUser.Response
			>(UsersCreateUser.topic, activationData.newUser);
			const tokens = await this.generateTokens(user);
			await this.storeRefreshToken(user._id, tokens.refreshToken);

			return tokens;
		}

		throw new ApiError(HttpStatus.UNAUTHORIZED, SIGNUP_CONFIRM_ERROR);
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
