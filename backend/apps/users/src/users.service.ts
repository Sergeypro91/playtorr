import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import {
	ApiError,
	ALREADY_REGISTERED_EMAIL_ERROR,
} from '@app/common/constants';
import {
	UserDto,
	NewUserDto,
	UsersEmailDto,
	EditableUserDto,
	UserWithoutPasswordDto,
} from '@app/common/contracts';
import { Role } from '@app/common/types';
import { UserEntity } from './entities';
import { UserRepository } from './repositories';

@Injectable()
export class UsersService {
	logger: Logger;

	constructor(private readonly userRepository: UserRepository) {
		this.logger = new Logger(UsersService.name);
	}

	public secureUser(user: UserDto): null | UserWithoutPasswordDto {
		if (user) {
			const { passwordHash, refreshTokenHash, ...userWithoutPassword } =
				user;

			return userWithoutPassword;
		}

		return user;
	}

	public async createUser(newUser: NewUserDto): Promise<UserDto> {
		const existUser = await this.findUserByEmail(newUser.email);

		if (existUser) {
			throw new ApiError(
				HttpStatus.CONFLICT,
				ALREADY_REGISTERED_EMAIL_ERROR,
			);
		}

		try {
			const usersCount = await this.countUsers();
			const newUserEntity = await new UserEntity({
				_id: '',
				...newUser,
				role: usersCount ? Role.GUEST : Role.ADMIN,
			}).setPassword(newUser.password);

			return this.userRepository.create(newUserEntity);
		} catch (error) {
			throw new ApiError(error.statusCode, error.message);
		}
	}

	public async findUserById(
		id: string,
	): Promise<null | UserWithoutPasswordDto> {
		try {
			return this.secureUser(await this.userRepository.findOneById(id));
		} catch (error) {
			throw new ApiError(error.statusCode, error.message);
		}
	}

	public async findUserByEmail(
		email: string,
	): Promise<null | UserWithoutPasswordDto> {
		try {
			return this.secureUser(
				await this.userRepository.findOneByEmail(email),
			);
		} catch (error) {
			throw new ApiError(error.statusCode, error.message);
		}
	}

	public async getUsers({
		users,
	}: UsersEmailDto): Promise<UserWithoutPasswordDto[]> {
		try {
			return this.userRepository.findManyByEmail(users);
		} catch (error) {
			throw new ApiError(error.statusCode, error.message);
		}
	}

	public async getUserUnsafeById(id: string): Promise<null | UserDto> {
		try {
			return this.userRepository.findOneById(id);
		} catch (error) {
			throw new ApiError(error.statusCode, error.message);
		}
	}

	public async getUserUnsafeByEmail(email: string): Promise<null | UserDto> {
		try {
			return this.userRepository.findOneByEmail(email);
		} catch (error) {
			throw new ApiError(error.statusCode, error.message);
		}
	}

	public async editUser(
		editableUser: EditableUserDto,
	): Promise<UserWithoutPasswordDto> {
		return this.secureUser(await this.userRepository.update(editableUser));
	}

	public async deleteUser(id: string): Promise<boolean> {
		await this.findUserById(id);

		try {
			await this.userRepository.delete(id);
		} catch (error) {
			throw new ApiError(error.statusCode, error.message);
		}

		return true;
	}

	public async countUsers(): Promise<number> {
		try {
			return this.userRepository.count();
		} catch (error) {
			throw new ApiError(error.statusCode, error.message);
		}
	}
}
