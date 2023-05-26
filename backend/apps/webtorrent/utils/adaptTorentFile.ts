import { WebTorrentFileInfoDto } from '@app/common';
import { TorrentFile } from 'webtorrent';

export const adaptTorrentFile = (
	files: TorrentFile[],
): WebTorrentFileInfoDto[] => {
	return files.map((file) => {
		return {
			name: file.name,
			length: file.length,
			offset: file?.['offset'],
			startPiece: file?.['_startPiece'],
			endPiece: file?.['_endPiece'],
		};
	});
};
