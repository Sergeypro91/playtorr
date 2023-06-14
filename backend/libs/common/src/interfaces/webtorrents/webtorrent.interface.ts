import { EnumStatus, MediaType } from '@app/common/types';

export interface IBaseWebTorrent {
	tmdbId: string;
	imdbId?: string | null;
	mediaType: MediaType;
}

export interface IWebTorrent extends IBaseWebTorrent {
	torrentUrl: string;
	torrentInfo?: IWebTorrentInfo;
}

export interface IWebTorrentInfo {
	name: string;
	length: number;
	files: IWebTorrentFileInfo[];
	created: string | Date;
}

export interface IMetadata {
	video?: IVideoFile[];
	audio?: IAudioFile[];
	subtitle?: ISubtitleFile[];
	status: EnumStatus;
	statusDescription?: string;
}

export interface IWebTorrentFileInfo {
	name: string;
	length: number;
	offset: number;
	startPiece: number;
	endPiece: number;
	supported?: boolean;
	metadata?: IMetadata;
}

export interface IBaseFile {
	codecName: string; // codec_name
	codecType: string; // codec_type
	profile?: string;
	timeBase?: string; // time_base
	duration?: number;
	bitRate?: number; // bit_rate
}

export interface IVideoFile extends IBaseFile {
	codecType: 'video'; // codec_type
	width: number;
	height: number;
	hasBFrames?: number; // has_b_frames
	sampleAspectRatio?: string; // sample_aspect_ratio
	displayAspectRatio?: string; // display_aspect_ratio
	pixFmt?: string; //
	level?: number;
	colorRange?: string; // color_range
	colorSpace?: string; // color_space
	isAvc?: string; // is_avc
	rFrameRate?: string; // r_frame_rate
	avgFrameRate?: string; // avg_frame_rate
}

export interface IAudioFile extends IBaseFile {
	codecType: 'audio'; // codec_type
	sampleRate?: number; // sample_rate
	channels?: number;
	channelLayout?: string; // channel_layout
}

export interface ISubtitleFile extends IBaseFile {
	codecType: 'subtitle'; // codec_type
}
