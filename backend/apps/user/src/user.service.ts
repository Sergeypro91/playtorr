import { Injectable, HttpStatus, Logger } from '@nestjs/common';
import { RMQError } from 'nestjs-rmq';
import {
	DBUserDto,
	EditUserDto,
	FindUserByDto,
	UserDto,
	UserEmailDto,
	UsersEmailDto,
	UserSessionDto,
} from '@app/contracts';
import { Role } from '@app/interfaces';
import {
	ALREADY_REGISTERED_EMAIL_ERROR,
	ALREADY_REGISTERED_TGID_ERROR,
	USER_WITH_TGID_EXIST_ERROR,
	USER_FORBIDDEN_ERROR,
	USER_NOT_FOUND_ERROR,
	USER_NOT_FOUND,
	USER_NOT_DELETE_ERROR,
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

	private handlingUserDB(user: User): DBUserDto {
		return {
			id: user._id,
			email: user.email,
			role: user.role,
			nickname: user.nickname,
			firstName: user.firstName,
			lastName: user.lastName,
			image: user.image,
			tgId: user.tgId,
		};
	}

	private async createUser({
		password,
		...newUserData
	}: UserDto): Promise<DBUserDto> {
		const usersCount = await this.countUsers();
		const newUserEntity = await new UserEntity({
			...newUserData,
			role: usersCount ? Role.GUEST : Role.ADMIN,
		}).setPassword(password);

		const newUser = await this.userRepository
			.createUser(newUserEntity)
			.then(this.handlingUserDB);

		this.logger.log(`New user: ${newUser.email} - added to DB`);

		return newUser;
	}

	public async countUsers() {
		return this.userRepository.countUsers();
	}

	async registerUser(newUser: UserDto): Promise<DBUserDto> {
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

	async findUserBy({ type, id }: FindUserByDto): Promise<User> {
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
	}

	async getUsers({ users }: UsersEmailDto): Promise<DBUserDto[]> {
		return this.userRepository
			.getUsers(users)
			.then((usersArr) => usersArr.map(this.handlingUserDB));
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
	async editUser(
		editableUser: EditUserDto,
		editingUser: UserSessionDto,
	): Promise<DBUserDto> {
		const isEditingUserAdmin = editingUser.role === Role.ADMIN;

		if (editingUser.email !== editableUser.email) {
			/* Если редактирующий пользователь не является редактируемым и у него нет Админ прав. */
			if (!isEditingUserAdmin) {
				throw new RMQError(
					USER_FORBIDDEN_ERROR,
					undefined,
					HttpStatus.FORBIDDEN,
				);
			}
		}

		const editableUserEmail = editableUser.email;
		const editedUser = await this.findUserBy({
			type: 'email',
			id: editableUserEmail,
		});

		/* Возможный сценарий, если пользователя с таким email нет, или если в
		 аргументе "editingUser" не был передан "email". */
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

		if (editableUser.role) {
			if (!isEditingUserAdmin) {
				throw new RMQError(
					USER_FORBIDDEN_ERROR,
					undefined,
					HttpStatus.FORBIDDEN,
				);
			}
		}

		return this.userRepository
			.updateUserData(editableUser.email, editableUser)
			.then(this.handlingUserDB);
	}

	async deleteUser(user: UserEmailDto): Promise<DBUserDto> {
		const deletingUserData = await this.findUserBy({
			type: 'email',
			id: user.email,
		}).then(this.handlingUserDB);

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
}
