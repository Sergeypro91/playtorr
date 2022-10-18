import { IsString } from 'class-validator';

export class MinIOFileDto {
	@IsString()
	name: string;

	@IsString()
	mimetype: string;

	@IsString()
	binaryBuffer: string;
}

export class MinIOFileUrlDto {
	@IsString()
	url: string;
}

export class MinIODeletedFileDto {
	@IsString()
	filename: string;
}

export class MinIODeletingConfirmDto {
	@IsString()
	message: string;
}
