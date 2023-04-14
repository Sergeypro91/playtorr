import { MinIOFileDto, MinIOFileUrlDto } from './minio.dto';

export namespace MinIOUploadFile {
	export const topic = 'minio.uploadFile.command';

	export class Request extends MinIOFileDto {}

	export class Response extends MinIOFileUrlDto {}
}
