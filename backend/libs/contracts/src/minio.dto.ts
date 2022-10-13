import { IsString } from 'class-validator';

export class MinIOUploadRequestDto {
	@IsString()
	name: string;

	@IsString()
	mimetype: string;

	@IsString()
	binaryBuffer: string;
}

export class MinIOUploadResponseDto {
	@IsString()
	url: string;
}

export class MinIODeleteRequestDto {
	@IsString()
	filename: string;
}

export class MinIODeleteResponseDto {
	@IsString()
	fileName: string;

	@IsString()
	message: string;
}
