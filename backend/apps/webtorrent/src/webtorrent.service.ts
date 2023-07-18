import fs from 'fs-extra';
import { RMQService } from 'nestjs-rmq';
import FSChunkStore from 'fs-chunk-store';
import WebTorrent, { TorrentOptions } from 'webtorrent';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
	GetFileMetadataDto,
	GetTorrentDistributionInfoRequestDto,
	MetadataDto,
	UploadTorrentFilesInfoDto,
	GetTorrentDistributionInfoResponseDto,
	WebTorrentInfoDto,
} from '@app/common/contracts';
import { daysPassed, ttlToDay } from '@app/common/utils';
import { EnumStatus, MediaType } from '@app/common/types';
import {
	CANT_COLLECT_METADATA,
	NO_PEERS,
	SUPPORTED_FILE_TYPE,
} from '@app/common/constants';
import {
	adaptTorrent,
	adaptTorrentFile,
	adaptTorrentFileMetadata,
	getFileFormat,
	getFileMetaData,
	getFileSize,
	onDestroy,
	torrentErrorHandling,
	torrentLogger as logger,
} from '../utils';
import { WebTorrentRepository } from './repositories';

@Injectable()
export class WebtorrentService {
	public clientOption: TorrentOptions;
	public movieTtl: number;
	public tvTtl: number;

	constructor(
		private readonly rmqService: RMQService,
		private readonly configService: ConfigService,
		private readonly webTorrentRepository: WebTorrentRepository,
	) {
		this.clientOption = {
			// TODO change on ENV props
			path: '/Users/sergeyshevtsov/Developer/Project/PlayTorr/torrent',
			destroyStoreOnDestroy: true,
			store: FSChunkStore,
		};
		this.movieTtl = parseInt(configService.get('MOVIE_TTL', '2592000'), 10);
		this.tvTtl = parseInt(configService.get('TV_TTL', '604800'), 10);
	}

	public async loadTorrentInfo(
		torrentIdentifiers: GetTorrentDistributionInfoRequestDto,
	): Promise<WebTorrentInfoDto> {
		return new Promise((resolve, reject) => {
			const client = new WebTorrent();

			client.add(
				torrentIdentifiers.torrentUrl,
				this.clientOption,
				(torrent) => {
					const slimTorrentInfo = {
						...adaptTorrent(torrent),
						files: adaptTorrentFile(torrent.files),
					};

					resolve(slimTorrentInfo);

					client.destroy(onDestroy());

					this.getTorrentFilesInfo({
						...torrentIdentifiers,
						torrentInfo: slimTorrentInfo,
					});
				},
			);

			client.on(
				'error',
				torrentErrorHandling({
					client,
					reject,
				}),
			);
		});
	}

	public async getTorrentInfo(
		torrentIdentifiers: GetTorrentDistributionInfoRequestDto,
	): Promise<GetTorrentDistributionInfoResponseDto> {
		let webTorrent = await this.webTorrentRepository.findTorrentInfo(
			torrentIdentifiers,
		);

		if (!webTorrent) {
			webTorrent = await this.webTorrentRepository.saveTorrentInfo({
				...torrentIdentifiers,
				imdbId:
					torrentIdentifiers.imdbId ||
					`tempId-${torrentIdentifiers.tmdbId}/${torrentIdentifiers.mediaType}`,
				torrentInfo: await this.loadTorrentInfo(torrentIdentifiers),
			});
		} else {
			const lastUpdateDayPassed = daysPassed({
				to: webTorrent['updatedAt'],
			});
			const ttlInDay = ttlToDay(
				webTorrent.mediaType === MediaType.MOVIE
					? this.movieTtl
					: this.tvTtl,
			);

			if (lastUpdateDayPassed > ttlInDay) {
				webTorrent = await this.webTorrentRepository.updateTorrentInfo({
					...torrentIdentifiers,
					torrentInfo: await this.loadTorrentInfo(torrentIdentifiers),
				});
			}
		}

		return webTorrent;
	}

	public async getTorrentFilesInfo({
		torrentUrl,
		torrentInfo,
		...rest
	}: UploadTorrentFilesInfoDto): Promise<void> {
		const filesToDownload = torrentInfo.files.map((file) => ({
			...file,
			supported: SUPPORTED_FILE_TYPE.includes(getFileFormat(file.name)),
			metadata: null,
		}));

		for (const fileToDownload of filesToDownload) {
			const fileId = filesToDownload.indexOf(fileToDownload);

			if (fileToDownload.supported) {
				torrentInfo.files[fileId].metadata = await this.getFileMetadata(
					{
						...rest,
						torrentUrl,
						fileId,
					},
				);

				await this.webTorrentRepository.updateTorrentInfo({
					torrentUrl,
					torrentInfo,
					...rest,
				});
			}
		}
	}

	public async getFileMetadata({
		torrentUrl,
		fileId,
	}: GetFileMetadataDto): Promise<MetadataDto> {
		return new Promise(async (resolve) => {
			const client = new WebTorrent();
			const torrent = client.add(
				torrentUrl,
				this.clientOption,
				handleClientAdd,
			);

			client.on('error', torrentErrorHandling({ client }));
			torrent.on('error', torrentErrorHandling({ client }));

			async function handleClientAdd(
				torrent: WebTorrent.Torrent,
			): Promise<void> {
				const torrentFile = torrent.files[fileId];
				const torrentDir = `${torrent.path}/${torrent.name}`;
				const fileDir = `${torrentDir}${fileId}`;
				const filePath = `${fileDir}/SAMPLE-${torrentFile.name}`;
				let readMetadataCounter = 1;
				let fileMetaData;

				await fs.ensureDirSync(fileDir);

				torrent.deselect(0, torrent.pieces.length - 1, 0);
				torrentFile.select();

				const readStream = torrentFile.createReadStream();
				const writeStream = fs.createWriteStream(filePath);

				readStream.pipe(writeStream);

				const interval = setInterval(async () => {
					try {
						if (fileMetaData) {
							clearInterval(interval);
							logger({
								warn: `FILE ID-${fileId}`,
							});
							fs.removeSync(fileDir);
							fs.removeSync(torrentDir);
							client.destroy(onDestroy());
							resolve(
								adaptTorrentFileMetadata(fileMetaData.streams),
							);
						} else if (readMetadataCounter > 3) {
							clearInterval(interval);
							client.destroy(onDestroy());
							resolve({
								status: EnumStatus.ERROR,
								statusDescription: CANT_COLLECT_METADATA,
							});
						} else if (getFileSize(filePath)) {
							readMetadataCounter++;
							fileMetaData = await getFileMetaData(filePath);
						}
					} catch (error) {
						logger({ error: 'ERROR ON FILE GET METADATA' });
					}
				}, 1000);

				torrent.on('noPeers', () => {
					clearInterval(interval);
					client.destroy(onDestroy());
					resolve({
						status: EnumStatus.ERROR,
						statusDescription: NO_PEERS,
					});
				});
			}
		});
	}
}
