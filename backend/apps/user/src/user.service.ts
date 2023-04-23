import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import {
	ApiError,
	USER_NOT_FOUND,
	USER_FORBIDDEN_ERROR,
	USER_NOT_FOUND_ERROR,
	USER_NOT_DELETE_ERROR,
	USER_WITH_TGID_EXIST_ERROR,
	ALREADY_REGISTERED_TGID_ERROR,
	ALREADY_REGISTERED_EMAIL_ERROR,
} from '@app/common/constants';
import {
	UserDto,
	DBUserDto,
	EditUserDto,
	UserEmailDto,
	FindUserByDto,
	UsersEmailDto,
	UserSessionDto,
	PushUserRecentViewDto,
} from '@app/common/contracts';
import { Role } from '@app/common/types';
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
			throw new ApiError(error.statusCode, error.message);
		}
	}

	public async signUp(newUser: UserDto): Promise<DBUserDto> {
		const existEmailUser = await this.findUserBy({
			type: 'email',
			id: newUser.email,
		});

		if (existEmailUser) {
			throw new ApiError(
				HttpStatus.CONFLICT,
				ALREADY_REGISTERED_EMAIL_ERROR,
			);
		}

		if (newUser.tgId) {
			const existTgIdUser = await this.findUserBy({
				type: 'tgId',
				id: `${newUser.tgId}`,
			});

			if (existTgIdUser) {
				throw new ApiError(
					HttpStatus.CONFLICT,
					ALREADY_REGISTERED_TGID_ERROR,
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
			throw new ApiError(error.statusCode, error.message);
		}
	}

	public async getUsers({ users }: UsersEmailDto): Promise<DBUserDto[]> {
		try {
			return this.userRepository.findUsersByEmail(users);
		} catch (error) {
			throw new ApiError(error.statusCode, error.message);
		}
	}

	/**
	 * @descriptionA Method for changing the data of an existing user.
	 * Used both to edit the user himself,
	 * and for editing the user by the Administrator, by
	 * matching the user's email address of the current active session with
	 * passed in the edited data.
	 * @param editableUser - Data of the edited user.
	 * @param editingUser - Editing user session.
	 * */
	public async editUser(
		editableUser: EditUserDto,
		editingUser: UserSessionDto,
	): Promise<DBUserDto> {
		const isEditingUserAdmin = editingUser.role === Role.ADMIN;

		/* Если редактирующий пользователь не является редактируемым и у него нет Админ прав. */
		if (editingUser.email !== editableUser.email && !isEditingUserAdmin) {
			throw new ApiError(HttpStatus.FORBIDDEN, USER_FORBIDDEN_ERROR);
		}

		const editableUserEmail = editableUser.email;
		const editedUser = await this.findUserBy({
			type: 'email',
			id: editableUserEmail,
		});

		if (!editedUser) {
			throw new ApiError(HttpStatus.NOT_FOUND, USER_NOT_FOUND_ERROR);
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
				throw new ApiError(
					HttpStatus.CONFLICT,
					USER_WITH_TGID_EXIST_ERROR,
				);
			}
		}

		/* Если редактируемый пользователь содержит "role", а у редактирующего нет Админ прав. */
		if (editableUser.role && !isEditingUserAdmin) {
			throw new ApiError(HttpStatus.FORBIDDEN, USER_FORBIDDEN_ERROR);
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
			throw new ApiError(HttpStatus.NOT_FOUND, USER_NOT_FOUND);
		}

		const { deletedCount } = await this.userRepository.deleteUsersByEmail(
			user.email,
		);

		if (!deletedCount) {
			throw new ApiError(HttpStatus.BAD_REQUEST, USER_NOT_DELETE_ERROR);
		}

		return deletingUserData;
	}

	public async countUsers() {
		try {
			return this.userRepository.countUsers();
		} catch (error) {
			throw new ApiError(error.statusCode, error.message);
		}
	}

	public async pushUserRecentView(recentView: PushUserRecentViewDto) {
		try {
			await this.userRepository.pushRecentView(recentView);
			return recentView;
		} catch (error) {
			throw new ApiError(error.statusCode, error.message);
		}
	}
}
