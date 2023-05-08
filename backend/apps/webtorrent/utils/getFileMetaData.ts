import ffmpeg from 'fluent-ffmpeg';

export const getFileMetaData = (
	filePath: string,
): Promise<ffmpeg.FfprobeData> => {
	return new Promise((resolve, reject) => {
		ffmpeg(filePath).ffprobe(async (err, info) => {
			if (err) {
				reject(err);
			} else {
				resolve(info);
			}
		});
	});
};
