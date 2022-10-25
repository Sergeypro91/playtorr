import {
	Logger,
	Injectable,
	NotFoundException,
	ConflictException,
	ForbiddenException,
} from '@nestjs/common';
import { UserEntity } from './entities';
import { UserRepository } from './repositories';
import {
	EditUserDto,
	UsersEmailDto,
	FindUserByDto,
	UserSessionDto,
} from '@app/contracts';
import { Role } from '@app/interfaces';
import {
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

	async createUser(user: UserEntity) {
		return this.userRepository.createUser(user);
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
