import {
	MinIODeleteRequestDto,
	MinIODeleteResponseDto,
} from '@app/contracts/minio.dto';

export namespace MinIODeleteFile {
	export const topic = 'minio.deleteFile.command';

	export class Request extends MinIODeleteRequestDto {}

	export class Response extends MinIODeleteResponseDto {}
}
