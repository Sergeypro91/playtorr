import { MinIOUploadRequestDto, MinIOUploadResponseDto } from '@app/contracts';

export namespace MinIOUploadFile {
	export const topic = 'minio.uploadFile.command';

	export class Request extends MinIOUploadRequestDto {}

	export class Response extends MinIOUploadResponseDto {}
}
