import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { RMQError } from 'nestjs-rmq';
import {
	UserDto,
	DBUserDto,
	EditUserDto,
	UserEmailDto,
	FindUserByDto,
	UsersEmailDto,
	UserSessionDto,
	PushUserRecentViewDto,
} from '@app/contracts';
import { Role } from '@app/types';
import {
	USER_NOT_FOUND,
	USER_FORBIDDEN_ERROR,
	USER_NOT_FOUND_ERROR,
	USER_NOT_DELETE_ERROR,
	USER_WITH_TGID_EXIST_ERROR,
	ALREADY_REGISTERED_TGID_ERROR,
	ALREADY_REGISTERED_EMAIL_ERROR,
} from '@app/constants';
import { User } from './models';
import { UserEntity } from './entities';
import { UserRepository } from './repositories';

@Injectable()
export class UserService {
	logger: Logger;

	constructor(private readonly userRepository: UserRepository) {
		this.logger = new Logger(UserService.name);
	}

	private async createUser(newUser: UserDto): Promise<DBUserDto> {
		try {
			const usersCount = await this.countUsers();
			const newUserEntity = await new UserEntity({
				...newUser,
				role: usersCount ? Role.GUEST : Role.ADMIN,
			}).setPassword(newUser.password);

			return this.userRepository.createUser(newUserEntity);
		} catch (error) {
			throw new RMQError(error.message, undefined, error.statusCode);
		}
	}

	public async signUp(newUser: UserDto): Promise<DBUserDto> {
		const existEmailUser = await this.findUserBy({
			type: 'email',
			id: newUser.email,
		});

		if (existEmailUser) {
			throw new RMQError(
				ALREADY_REGISTERED_EMAIL_ERROR,
				undefined,
				HttpStatus.CONFLICT,
			);
		}

		if (newUser.tgId) {
			const existTgIdUser = await this.findUserBy({
				type: 'tgId',
				id: `${newUser.tgId}`,
			});

			if (existTgIdUser) {
				throw new RMQError(
					ALREADY_REGISTERED_TGID_ERROR,
					undefined,
					HttpStatus.CONFLICT,
				);
			}
		}

		return this.createUser(newUser);
	}

	public async validateUser(email: string): Promise<DBUserDto> {
		return this.userRepository.validateUser(email);
	}

	public async findUserBy({ type, id }: FindUserByDto): Promise<User> {
		try {
			switch (type) {
				case 'email':
					return this.userRepository.findUserByEmail(id);
				case 'id':
					return this.userRepository.findUserById(id);
				case 'tgId':
					return this.userRepository.findUserByTgId(parseInt(id, 10));
				default:
					break;
			}
		} catch (error) {
			throw new RMQError(error.message, undefined, error.statusCode);
		}
	}

	public async getUsers({ users }: UsersEmailDto): Promise<DBUserDto[]> {
		try {
			return this.userRepository.findUsersByEmail(users);
		} catch (error) {
			throw new RMQError(error.message, undefined, error.statusCode);
		}
	}

	/**
	 * Метод изменения данных существующего пользователя.
	 * Используется как для редактирования пользователя самого себя,
	 * так и для редактирования пользователя Администратором, путем
	 * сопоставления email пользователя текущей активной сессии с
	 * переданными в редактируемых данных.
	 * @param editableUser - Данные редактируемого пользователя.
	 * @param editingUser - Сессия редактирующего пользователя.
	 * */
	public async editUser(
		editableUser: EditUserDto,
		editingUser: UserSessionDto,
	): Promise<DBUserDto> {
		const isEditingUserAdmin = editingUser.role === Role.ADMIN;

		/* Если редактирующий пользователь не является редактируемым и у него нет Админ прав. */
		if (editingUser.email !== editableUser.email && !isEditingUserAdmin) {
			throw new RMQError(
				USER_FORBIDDEN_ERROR,
				undefined,
				HttpStatus.FORBIDDEN,
			);
		}

		const editableUserEmail = editableUser.email;
		const editedUser = await this.findUserBy({
			type: 'email',
			id: editableUserEmail,
		});

		if (!editedUser) {
			throw new RMQError(
				USER_NOT_FOUND_ERROR,
				undefined,
				HttpStatus.NOT_FOUND,
			);
		}

		if (editableUser.tgId) {
			const existingTgIdUser = await this.findUserBy({
				type: 'tgId',
				id: `${editableUser.tgId}`,
			});

			if (
				existingTgIdUser &&
				existingTgIdUser.email !== editableUser.email
			) {
				/* Если редактируемый пользователь содержит "tgId" ранее использованный кем-то другим. */
				throw new RMQError(
					USER_WITH_TGID_EXIST_ERROR,
					undefined,
					HttpStatus.CONFLICT,
				);
			}
		}

		/* Если редактируемый пользователь содержит "role", а у редактирующего нет Админ прав. */
		if (editableUser.role && !isEditingUserAdmin) {
			throw new RMQError(
				USER_FORBIDDEN_ERROR,
				undefined,
				HttpStatus.FORBIDDEN,
			);
		}

		return this.userRepository.updateUserData(
			editableUser.email,
			editableUser,
		);
	}

	public async deleteUser(user: UserEmailDto): Promise<DBUserDto> {
		const deletingUserData = await this.findUserBy({
			type: 'email',
			id: user.email,
		});

		if (!deletingUserData) {
			throw new RMQError(USER_NOT_FOUND, undefined, HttpStatus.NOT_FOUND);
		}

		const { deletedCount } = await this.userRepository.deleteUsersByEmail(
			user.email,
		);

		if (!deletedCount) {
			throw new RMQError(
				USER_NOT_DELETE_ERROR,
				undefined,
				HttpStatus.BAD_REQUEST,
			);
		}

		return deletingUserData;
	}

	public async countUsers() {
		try {
			return this.userRepository.countUsers();
		} catch (error) {
			throw new RMQError(error.message, undefined, error.statusCode);
		}
	}

	public async pushUserRecentView(recentView: PushUserRecentViewDto) {
		try {
			await this.userRepository.pushRecentView(recentView);
			return recentView;
		} catch (error) {
			throw new RMQError(error.message, undefined, error.statusCode);
		}
	}
}
