import {
	Logger,
	Injectable,
	NotFoundException,
	ConflictException,
	ForbiddenException,
	BadRequestException,
} from '@nestjs/common';
import { UserEntity } from './entities';
import { UserRepository } from './repositories';
import {
	EditUserDto,
	UsersEmailDto,
	FindUserByDto,
	UserSessionDto,
	UserDto,
	DBUserDto,
} from '@app/contracts';
import { Role } from '@app/interfaces';
import {
	ALREADY_REGISTERED_EMAIL_ERROR,
	ALREADY_REGISTERED_TGID_ERROR,
	USER_NOT_FOUND_ERROR,
	USER_WITH_TGID_EXIST_ERROR,
} from '@app/constants';

// TODO Remove "passwordHash" from user DB response
@Injectable()
export class UserService {
	logger: Logger;

	constructor(private readonly userRepository: UserRepository) {
		this.logger = new Logger(UserService.name);
	}

	async countUsers() {
		return this.userRepository.countUsers();
	}

	async registerUser(newUser: UserDto): Promise<DBUserDto> {
		const existEmailUser = await this.findUserBy({
			type: 'email',
			id: newUser.email,
		});

		if (existEmailUser) {
			throw new BadRequestException(ALREADY_REGISTERED_EMAIL_ERROR);
		}

		if (newUser.tgId) {
			const existTgIdUser = await this.findUserBy({
				type: 'tgId',
				id: `${newUser.tgId}`,
			});

			if (existTgIdUser) {
				throw new BadRequestException(ALREADY_REGISTERED_TGID_ERROR);
			}
		}

		return this.createUser(newUser);
	}

	async createUser({
		password,
		...newUserData
	}: UserDto): Promise<DBUserDto> {
		const usersCount = await this.countUsers();
		const newUserEntity = await new UserEntity({
			...newUserData,
			role: usersCount ? Role.GUEST : Role.ADMIN,
		}).setPassword(password);

		const newUser = await this.userRepository.createUser(newUserEntity);

		this.logger.log(`New user: ${newUser.email} - added to DB`);

		return newUser;
	}

	async findUserBy({ type, id }: FindUserByDto) {
		switch (type) {
			case 'email':
				return this.userRepository.findUserByEmail(id);
			case 'id':
				return this.userRepository.findUserById(id);
			case 'tgId':
				return this.userRepository.findUserByTgId(parseInt(id, 10));
			default:
				throw new ConflictException();
		}
	}

	async getUsers({ users }: UsersEmailDto) {
		return this.userRepository.getUsers(users);
	}

	async editUser(editableUser: EditUserDto, editingUser: UserSessionDto) {
		const isEditingUserAdmin = editingUser.role === Role.ADMIN;

		if (editingUser.email !== editableUser.email) {
			if (!isEditingUserAdmin) {
				throw new ForbiddenException();
			}
		}

		const editableUserEmail = editableUser.email || editingUser.email;
		const editedUser = await this.findUserBy({
			type: 'email',
			id: editableUserEmail,
		});

		if (!editedUser) {
			throw new NotFoundException(USER_NOT_FOUND_ERROR);
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
				throw new ConflictException(USER_WITH_TGID_EXIST_ERROR);
			}
		}

		if (editableUser.role) {
			if (!isEditingUserAdmin) {
				throw new ForbiddenException();
			}
		}

		return this.userRepository.updateUserData(
			editableUser.email,
			editableUser,
		);
	}

	async deleteUsers(users: string[]) {
		return this.userRepository.deleteUsers(users);
	}
}
