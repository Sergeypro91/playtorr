import { DeletedFileDto, DeletingConfirmDto } from '../dtos';

export namespace MinIODeleteFile {
	export const topic = 'minio.deleteFile.command';

	export class Request extends DeletedFileDto {}

	export class Response extends DeletingConfirmDto {}
}
