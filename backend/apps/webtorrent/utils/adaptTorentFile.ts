import { TorrentDistributionDto } from '@app/common';
import { TorrentFile } from 'webtorrent';

export const adaptTorrentFile = (
	files: TorrentFile[],
): TorrentDistributionDto[] => {
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
