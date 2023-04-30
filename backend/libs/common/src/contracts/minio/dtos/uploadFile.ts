import { IsArray, IsObject, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class FileDto {
	@IsString()
	name: string;

	@IsString()
	mimetype: string;

	@IsString()
	binaryBuffer: string;
}

export class UploadFile {
	@IsObject()
	@Type(() => FileDto)
	fileDto: FileDto;

	@IsArray()
	fileTypes: string[];
}

export class FileUrlDto {
	@IsString()
	url: string;
}
