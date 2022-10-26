import { Logger, Injectable, HttpStatus } from '@nestjs/common';
import { Client, Region } from 'minio';
import { MinIOOptions } from '@app/interfaces/minio/minio.interface';
import { getMinIOConfig } from './configs';
import { ConfigService } from '@nestjs/config';
import {
	MinIODeletingConfirmDto,
	MinIOFileDto,
	MinIOFileUrlDto,
} from '@app/contracts';
import { defineBucketPolicy } from './policy';
import {
	FILE_DOESNT_EXIST,
	FAILED_TO_UPLOAD,
	FILE_TYPE_UNSUPPORTED,
} from '@app/constants';
import { RMQError } from 'nestjs-rmq';

@Injectable()
export class MinIOService {
	logger: Logger;
	client: Client;
	options: MinIOOptions;

	constructor(private readonly configService: ConfigService) {
		this.logger = new Logger(MinIOService.name);
		this.options = getMinIOConfig(configService);
		this.client = new Client(this.options);
		this.createBucket('eu-central-1').catch((error) => {
			this.logger.log(error.message);
		});
		this.client.setBucketPolicy(
			this.options.bucketName,
			JSON.stringify(defineBucketPolicy(this.options.bucketName)),
			(error) => {
				if (error) {
					throw error;
				}

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
		fileDto: MinIOFileDto,
		fileTypes: string[],
	): Promise<MinIOFileUrlDto> {
		const PORT = this.options.port;
		const ENDPOINT = this.options.endPoint;
		const BUCKET_NAME = this.options.bucketName;
		const FILE_NAME = fileDto.name;
		const FILE_BUFFER = Buffer.from(fileDto.binaryBuffer, 'base64');
		const FILE_MIME_TYPE = fileDto.mimetype.split('/')[1];

		if (!fileTypes.includes(FILE_MIME_TYPE)) {
			throw new RMQError(
				FILE_TYPE_UNSUPPORTED,
				undefined,
				HttpStatus.UNSUPPORTED_MEDIA_TYPE,
			);
		}

		try {
			await this.client.putObject(BUCKET_NAME, FILE_NAME, FILE_BUFFER);
			return {
				url: `${ENDPOINT}:${PORT}/${BUCKET_NAME}/${FILE_NAME}`,
			};
		} catch (error) {
			if (error instanceof Error) {
				throw new RMQError(
					FAILED_TO_UPLOAD,
					undefined,
					HttpStatus.BAD_REQUEST,
				);
			}
		}
	}

	async delete(filename: string): Promise<MinIODeletingConfirmDto> {
		try {
			await this.client.statObject(this.options.bucketName, filename);
			await this.client.removeObject(this.options.bucketName, filename);
			return { message: `${filename} - был успешно удален` };
		} catch (error) {
			if (error instanceof Error) {
				throw new RMQError(
					FILE_DOESNT_EXIST,
					undefined,
					HttpStatus.NOT_FOUND,
				);
			}
		}
	}
}
