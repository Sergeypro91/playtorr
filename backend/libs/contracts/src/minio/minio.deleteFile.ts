import { MinIODeletedFileDto, MinIODeletingConfirmDto } from '@app/contracts';

export namespace MinIODeleteFile {
	export const topic = 'minio.deleteFile.command';

	export class Request extends MinIODeletedFileDto {}

	export class Response extends MinIODeletingConfirmDto {}
}
