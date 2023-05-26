import {
	AudioFileDto,
	MetadataDto,
	SubtitleFileDto,
	VideoFileDto,
} from '@app/common/contracts';
import { EnumStatus } from '@app/common/types';

type Result = {
	video: VideoFileDto[];
	audio: AudioFileDto[];
	subtitle: SubtitleFileDto[];
};

const handleValue = (value) => {
	if (value === 'N/A' || value === 'unknown') {
		return undefined;
	}

	return value;
};

const removeUndefinedKeyVal = (object: unknown) => {
	return JSON.parse(JSON.stringify(object));
};

export const adaptTorrentFileMetadata = (
	metaDataStreams: unknown[],
): MetadataDto => {
	const result = metaDataStreams.reduce(
		(result: Result, metaData) => {
			if (metaData['codec_type'] === 'video') {
				result.video.push(
					removeUndefinedKeyVal({
						codecName: handleValue(metaData['codec_name']),
						codecType: handleValue(metaData['codec_type']),
						profile: handleValue(metaData?.['profile']),
						timeBase: handleValue(metaData?.['time_base']),
						duration: handleValue(metaData?.['duration']),
						bitRate: handleValue(metaData?.['bit_rate']),
						width: handleValue(metaData['width']),
						height: handleValue(metaData['height']),
						hasBFrames: handleValue(metaData?.['has_b_frames']),
						sampleAspectRatio: handleValue(
							metaData?.['sample_aspect_ratio'],
						),
						displayAspectRatio: handleValue(
							metaData?.['display_aspect_ratio'],
						),
						pixFmt: handleValue(metaData?.['pix_fmt']),
						level: handleValue(metaData?.['level']),
						colorRange: handleValue(metaData?.['color_range']),
						colorSpace: handleValue(metaData?.['color_space']),
						isAvc: Boolean(handleValue(metaData?.['is_avc'])),
						rFrameRate: handleValue(metaData?.['r_frame_rate']),
						avgFrameRate: handleValue(metaData?.['avg_frame_rate']),
					}),
				);

				return result;
			}

			if (metaData['codec_type'] === 'audio') {
				result.audio.push(
					removeUndefinedKeyVal({
						codecName: handleValue(metaData['codec_name']),
						codecType: handleValue(metaData['codec_type']),
						profile: handleValue(metaData?.['profile']),
						timeBase: handleValue(metaData?.['time_base']),
						duration: handleValue(metaData?.['duration']),
						bitRate: handleValue(metaData?.['bit_rate']),
						sampleRate: handleValue(metaData?.['sample_rate']),
						channels: handleValue(metaData?.['channels']),
						channelLayout: handleValue(
							metaData?.['channel_layout'],
						),
					}),
				);

				return result;
			}

			if (metaData['codec_type'] === 'subtitle') {
				result.subtitle.push(
					removeUndefinedKeyVal({
						codecName: handleValue(metaData['codec_name']),
						codecType: handleValue(metaData['codec_type']),
						profile: handleValue(metaData?.['profile']),
						timeBase: handleValue(metaData?.['time_base']),
						duration: handleValue(metaData?.['duration']),
						bitRate: handleValue(metaData?.['bit_rate']),
					}),
				);

				return result;
			}
		},
		{ video: [], audio: [], subtitle: [] },
	);

	return { ...(result as Result), status: EnumStatus.FINISHED };
};
