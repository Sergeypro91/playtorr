import { IsString } from 'class-validator';

export class DeletedFileDto {
	@IsString()
	filename: string;
}

export class DeletingConfirmDto {
	@IsString()
	message: string;
}
