import {
	Inject,
	Logger,
	Injectable,
	HttpStatus,
	HttpException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { Client, Region, NoResultCallback } from 'minio';
import { MinIOOptions } from '@app/interfaces/minio/minio.interface';
import { MINIO_MODULE_OPTIONS } from '@app/constants/minio/minio.constants';
import { BufferedFile } from './models/minio.model';

@Injectable()
export class MinIOService {
	logger: Logger;
	client: Client;
	options: MinIOOptions;

	constructor(@Inject(MINIO_MODULE_OPTIONS) options: MinIOOptions) {
		this.logger = new Logger('MinioService');
		this.client = new Client(options);
		this.options = options;
		this.createBucket('eu-central-1');
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

	async upload(file: BufferedFile) {
		const PORT = this.options.port;
		const ENDPOINT = this.options.endPoint;
		const BUCKET_NAME = this.options.bucketName;

		if (
			!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))
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
		const extension = file.originalname.substring(
			file.originalname.lastIndexOf('.'),
			file.originalname.length,
		);
		const metaData: { [key: string]: any } = {
			'Content-Type': file.mimetype,
		};

		// We need to append the extension at the end otherwise Minio will save it as a generic file
		const fileName = hashedFileName + extension;

		// TODO handle error
		this.client.putObject(BUCKET_NAME, fileName, file.buffer, metaData);

		return {
			url: `${ENDPOINT}:${PORT}/${BUCKET_NAME}/${fileName}`,
		};
	}

	getFile(
		filename: string,
		bucketName: undefined | string = this.options.bucketName,
	) {
		return this.client.getObject(
			bucketName,
			filename,
			async function (err, data) {
				if (err) {
					return console.log(err);
				}
				// return await data.Body.toString('utf-8');
			},
		);
	}

	async delete(
		objetName: string,
		bucketName: undefined | string = this.options.bucketName,
	) {
		this.client.removeObject(bucketName, objetName, <NoResultCallback>(
			function (err: any, res: any) {
				if (err)
					throw new HttpException(
						'An error occurred when deleting!',
						HttpStatus.BAD_REQUEST,
					);
			}
		));
	}
}
