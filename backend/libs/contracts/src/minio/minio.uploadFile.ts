import { MinIOFileDto, MinIOFileUrlDto } from '@app/contracts';

export namespace MinIOUploadFile {
	export const topic = 'minio.uploadFile.command';

	export class Request extends MinIOFileDto {}

	export class Response extends MinIOFileUrlDto {}
}
