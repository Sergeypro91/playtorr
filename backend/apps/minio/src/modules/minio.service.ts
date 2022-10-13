import { Logger, Injectable, HttpStatus, HttpException } from '@nestjs/common';
import * as crypto from 'crypto';
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
			// TODO handle exceptions
			console.log('MinIO ERROR', error);
		});
		this.client.setBucketPolicy(
			this.options.bucketName,
			JSON.stringify(defineBucketPolicy(this.options.bucketName)),
			function (err) {
				if (err) throw err;
				// TODO handle exceptions
				console.log('Bucket policy set');
			},
		);
	}

	async createBucket(region: Region) {
		const currBucket = await this.client.bucketExists(
			this.options.bucketName,
		);

		if (!currBucket) {
			this.client.makeBucket(this.options.bucketName, region, (err) => {
				if (err) {
					this.logger.error(err);
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
	): Promise<MinIOUploadResponseDto> {
		const PORT = this.options.port;
		const ENDPOINT = this.options.endPoint;
		const BUCKET_NAME = this.options.bucketName;

		if (
			!(
				fileDto.mimetype.includes('jpeg') ||
				fileDto.mimetype.includes('png')
			)
		) {
			throw new HttpException(
				'File type not supported',
				HttpStatus.BAD_REQUEST,
			);
		}

		const timestamp = Date.now().toString();
		const hashedFileName = crypto
			.createHash('md5')
			.update(timestamp)
			.digest('hex');
		const extension = fileDto.name.substring(
			fileDto.name.lastIndexOf('.'),
			fileDto.name.length,
		);
		const metaData: { [key: string]: any } = {
			'Content-Type': fileDto.mimetype,
		};
		const fileName = hashedFileName + extension;
		const fileBuffer = Buffer.from(fileDto.binaryBuffer, 'base64');

		this.client.putObject(BUCKET_NAME, fileName, fileBuffer, metaData);

		return {
			url: `${ENDPOINT}:${PORT}/${BUCKET_NAME}/${fileName}`,
		};
	}

	async delete(fileName: string): Promise<MinIODeleteResponseDto> {
		await this.client.removeObject(
			this.options.bucketName,
			fileName,
			(err: any) => {
				if (err)
					throw new HttpException(
						'An error occurred when deleting!',
						HttpStatus.BAD_REQUEST,
					);
			},
		);

		return { fileName, message: 'Файл был успешно удален' };
	}
}
