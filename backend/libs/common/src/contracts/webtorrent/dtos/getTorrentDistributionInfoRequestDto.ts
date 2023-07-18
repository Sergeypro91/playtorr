import {
	IsArray,
	IsBoolean,
	IsEnum,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BasePictureDto } from '../../base.dto';
import {
	IAudioFile,
	IBaseFile,
	IMetadata,
	ISubtitleFile,
	IVideoFile,
	IWebTorrentFileInfo,
	IWebTorrentInfo,
} from '@app/common/interfaces';
import { EnumStatus, MediaType } from '@app/common/types';

export class GetTorrentDistributionInfoRequestDto extends BasePictureDto {
	@IsString()
	torrentUrl: string;
}

export class BaseFileDto implements IBaseFile {
	@IsString()
	codecName: string; // codec_name

	@IsString()
	codecType: string; // codec_type

	@IsString()
	@IsOptional()
	profile?: string;

	@IsString()
	@IsOptional()
	timeBase?: string; // time_base

	@IsNumber()
	@IsOptional()
	duration?: number;

	@IsNumber()
	@IsOptional()
	bitRate?: number; // bit_rate
}

export class VideoFileDto extends BaseFileDto implements IVideoFile {
	@IsString()
	codecType: 'video'; // codec_type

	@IsNumber()
	width: number;

	@IsNumber()
	height: number;

	@IsNumber()
	@IsOptional()
	hasBFrames?: number; // has_b_frames

	@IsString()
	@IsOptional()
	sampleAspectRatio?: string; // sample_aspect_ratio

	@IsString()
	@IsOptional()
	displayAspectRatio?: string; // display_aspect_ratio

	@IsString()
	@IsOptional()
	pixFmt?: string; // pix_fmt

	@IsNumber()
	@IsOptional()
	level?: number;

	@IsString()
	@IsOptional()
	colorRange?: string; // color_range

	@IsString()
	@IsOptional()
	colorSpace?: string; // color_space

	@IsString()
	@IsOptional()
	isAvc?: string; // is_avc

	@IsString()
	@IsOptional()
	rFrameRate?: string; // r_frame_rate

	@IsString()
	@IsOptional()
	avgFrameRate?: string; // avg_frame_rate
}

export class AudioFileDto extends BaseFileDto implements IAudioFile {
	@IsString()
	codecType: 'audio'; // codec_type

	@IsNumber()
	@IsOptional()
	sampleRate?: number; // sample_rate

	@IsNumber()
	@IsOptional()
	channels?: number;

	@IsString()
	@IsOptional()
	channelLayout?: string; // channel_layout
}

export class SubtitleFileDto extends BaseFileDto implements ISubtitleFile {
	@IsString()
	codecType: 'subtitle'; // codec_type
}

export class MetadataDto implements IMetadata {
	@IsOptional()
	@IsObject()
	@Type(() => VideoFileDto)
	video?: VideoFileDto[];

	@IsOptional()
	@IsObject()
	@Type(() => AudioFileDto)
	audio?: AudioFileDto[];

	@IsOptional()
	@IsObject()
	@Type(() => SubtitleFileDto)
	subtitle?: SubtitleFileDto[];

	@IsEnum(EnumStatus)
	status: EnumStatus;

	@IsOptional()
	@IsString()
	statusDescription?: string;
}

export class WebTorrentFileInfoDto implements IWebTorrentFileInfo {
	@IsString()
	name: string;

	@IsNumber()
	length: number;

	@IsNumber()
	offset: number;

	@IsNumber()
	startPiece: number;

	@IsNumber()
	endPiece: number;

	@IsOptional()
	@IsBoolean()
	supported?: boolean;

	@IsOptional()
	@IsObject()
	@Type(() => MetadataDto)
	metadata?: MetadataDto;
}

export class WebTorrentInfoDto implements IWebTorrentInfo {
	@IsString()
	name: string;

	@IsNumber()
	length: number;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => WebTorrentFileInfoDto)
	files: WebTorrentFileInfoDto[];

	@IsString()
	created: string | Date;
}

export class GetTorrentDistributionInfoResponseDto {
	@IsString()
	tmdbId: string;

	@IsOptional()
	@IsString()
	imdbId?: string | null;

	@IsEnum(MediaType)
	mediaType: MediaType;

	@IsString()
	torrentUrl: string;

	@IsOptional()
	@IsObject()
	@Type(() => WebTorrentInfoDto)
	torrentInfo?: WebTorrentInfoDto;
}
