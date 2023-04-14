import { MinIODeletedFileDto, MinIODeletingConfirmDto } from './minio.dto';

export namespace MinIODeleteFile {
	export const topic = 'minio.deleteFile.command';

	export class Request extends MinIODeletedFileDto {}

	export class Response extends MinIODeletingConfirmDto {}
}
