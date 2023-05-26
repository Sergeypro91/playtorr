import { FileUrlDto, UploadFile } from '../dtos';

export namespace MinIOUploadFile {
	export const topic = 'minio.uploadFile.command';

	export class Request extends UploadFile {}

	export class Response extends FileUrlDto {}
}
