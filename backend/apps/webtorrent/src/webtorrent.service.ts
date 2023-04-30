import fs from 'fs-extra';
import WebTorrent, { TorrentOptions } from 'webtorrent';
import FSChunkStore from 'fs-chunk-store';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	UploadTorrentFilesInfoDto,
	TorrentDistributionInfoDto,
	GetTorrentDistributionInfoDto,
} from '@app/common/contracts/webtorrent';
import {
	adaptTorrent,
	adaptTorrentFile,
	getFileFormat,
	getFileMetaData,
	getFileSize,
	onDestroy,
} from '../utils';
import { supportedFileType } from '@app/common';

@Injectable()
export class WebtorrentService {
	public clientOption: TorrentOptions;

	constructor(private readonly configService: ConfigService) {
		this.clientOption = {
			path: '/Users/sergeyshevtsov/Developer/Project/PlayTorr/torrent',
			destroyStoreOnDestroy: true,
			store: FSChunkStore,
		};
	}

	public async getTorrentInfo({
		torrentUrl,
		...rest
	}: GetTorrentDistributionInfoDto): Promise<TorrentDistributionInfoDto> {
		return new Promise((resolve, reject) => {
			const client = new WebTorrent();

			client.add(torrentUrl, this.clientOption, (torrent) => {
				const torrentData = {
					...adaptTorrent(torrent),
					files: adaptTorrentFile(torrent.files),
				};
				resolve(torrentData);
				this.getTorrentFilesInfo({
					...rest,
					torrentUrl,
					torrentData,
				});
				client.destroy(onDestroy);
			});

			client.on('error', (error) => {
				reject(error);
				client.destroy(onDestroy);
			});
		});
	}

	public async getTorrentFilesInfo({
		torrentUrl,
		torrentData,
	}: UploadTorrentFilesInfoDto): Promise<void> {
		const filesToDownload = torrentData.files.map((file) => {
			const supported = supportedFileType.includes(
				getFileFormat(file.name),
			);

			return {
				...file,
				supported,
				metadata: null,
			};
		});

		filesToDownload.forEach((file, id) => {
			if (file.supported) {
				this.getFileMetadata({ torrentUrl, id });
			}
		});
	}

	public async getFileMetadata({
		torrentUrl,
		id,
	}: {
		torrentUrl: string;
		id: number;
	}): Promise<void> {
		const client = new WebTorrent();
		const torrent = client.add(
			torrentUrl,
			this.clientOption,
			handleClientAdd,
		);

		async function handleClientAdd(
			torrent: WebTorrent.Torrent,
		): Promise<void> {
			const torrentFiles = torrent.files;
			const torrentFile = torrentFiles[id];
			const torrentDir = `${torrent.path}/${torrent.name}`;
			const fileDir = `${torrentDir}${id}`;
			const filePath = `${fileDir}/TEST${torrentFile.name}`;
			let fileMetaData;

			await fs.ensureDirSync(fileDir);

			torrent.deselect(0, torrent.pieces.length - 1, 0);
			torrentFile.select();

			const readStream = torrentFile.createReadStream();
			const writeStream = fs.createWriteStream(filePath);

			readStream.pipe(writeStream);

			const updateInterval = setInterval(async () => {
				try {
					if (fileMetaData) {
						clearInterval(updateInterval);
						console.log(`FILE ID-${id}`);
						fs.removeSync(fileDir);
						client.destroy(onDestroy);
					} else if (getFileSize(filePath)) {
						fileMetaData = await getFileMetaData(filePath);
					}
				} catch (error) {
					console.log('ERROR ON FILE GET METADATA');
				}
			}, 1000);
		}

		client.on('error', (error) => {
			console.log('CODE COME HERE', error);
			client.destroy(onDestroy);
		});

		torrent.on('error', (error) => {
			console.log('CATCH ERROR', error);
			client.destroy(onDestroy);
		});
	}
}
