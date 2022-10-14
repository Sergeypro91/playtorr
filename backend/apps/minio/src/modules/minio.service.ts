import { Logger, Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { Client, Region } from 'minio';
import { MinIOOptions } from '@app/interfaces/minio/minio.interface';
import { getMinIOConfig } from '../utils/configs';
import { ConfigService } from '@nestjs/config';
import {
	MinIODeleteResponseDto,
	MinIOUploadRequestDto,
	MinIOUploadResponseDto,
} from '@app/contracts';
import { defineBucketPolicy } from '../utils/policy';
import {
	FAILED_TO_DELETE,
	FAILED_TO_UPLOAD,
	FILE_TYPE_UNSUPPORTED,
} from '@app/constants';

@Injectable()
export class MinIOService {
	logger: Logger;
	client: Client;
	options: MinIOOptions;

	constructor(private readonly configService: ConfigService) {
		this.logger = new Logger('MinioService');
		this.options = getMinIOConfig(configService);
		this.client = new Client(this.options);
		this.createBucket('eu-central-1').catch((error) => {
			this.logger.log(error.message);
		});
		this.client.setBucketPolicy(
			this.options.bucketName,
			JSON.stringify(defineBucketPolicy(this.options.bucketName)),
			(error) => {
				if (error) throw error;
				this.logger.log('Bucket policy set');
			},
		);
	}

	async createBucket(region: Region) {
		const currBucket = await this.client.bucketExists(
			this.options.bucketName,
		);

		if (!currBucket) {
			this.client.makeBucket(this.options.bucketName, region, (error) => {
				if (error) {
					this.logger.error(error);
				} else {
					this.logger.log(
						`Bucket created successfully in "${region}".`,
					);
				}
			});
		} else {
			this.logger.warn(`Bucket created earlier in "${region}".`);
		}
	}

	async upload(
		fileDto: MinIOUploadRequestDto,
		fileTypes: string[],
	): Promise<MinIOUploadResponseDto> {
		const PORT = this.options.port;
		const ENDPOINT = this.options.endPoint;
		const BUCKET_NAME = this.options.bucketName;
		const FILE_NAME = fileDto.name;
		const FILE_BUFFER = Buffer.from(fileDto.binaryBuffer, 'base64');
		const FILE_MIME_TYPE = fileDto.mimetype.split('/')[1];
		const FILE_META_DATA = {
			'Content-Type': fileDto.mimetype,
		};

		if (!fileTypes.includes(FILE_MIME_TYPE)) {
			throw new HttpException(
				FILE_TYPE_UNSUPPORTED,
				HttpStatus.UNSUPPORTED_MEDIA_TYPE,
			);
		}

		try {
			this.client.putObject(
				BUCKET_NAME,
				FILE_NAME,
				FILE_BUFFER,
				FILE_META_DATA,
			);
		} catch (error) {
			throw new HttpException(
				FAILED_TO_UPLOAD,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

		return {
			url: `${ENDPOINT}:${PORT}/${BUCKET_NAME}/${FILE_NAME}`,
		};
	}

	async delete(filename: string): Promise<MinIODeleteResponseDto> {
		try {
			await this.client.removeObject(this.options.bucketName, filename);
		} catch (error) {
			throw new HttpException(
				FAILED_TO_DELETE,
				HttpStatus.INTERNAL_SERVER_ERROR,
			);
		}

		return { message: `Файл "${filename}" был успешно удален` };
	}
}
