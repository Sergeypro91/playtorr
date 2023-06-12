import {
	IsString,
	IsRFC3339,
	IsBoolean,
	IsArray,
	IsOptional,
	IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IPreview, ISection, ISectionTile } from '@app/common/interfaces';

export class SectionTileDto implements ISectionTile {
	@IsOptional()
	@IsString()
	title?: string;

	@IsOptional()
	@IsString()
	subtitle?: string;

	@IsString()
	image_url: string;

	@IsString()
	image_ratio: string;

	@IsString()
	action_data: string;

	@IsBoolean()
	is_playable: boolean;

	@IsOptional()
	@IsRFC3339()
	display_from?: number;

	@IsOptional()
	@IsRFC3339()
	display_until?: number;

	@IsOptional()
	@IsNumber()
	position?: number;
}

export class SectionDto implements ISection {
	@IsOptional()
	@IsString()
	title?: string;

	@IsOptional()
	@IsNumber()
	position?: number;

	@IsOptional()
	@IsString()
	title_display_mode?: string;
	subtitle_display_mode?: string;

	@IsArray()
	@Type(() => SectionTileDto)
	tiles: SectionTileDto[];
}

export class GetPreviewRequestDto {}

export class GetPreviewResultDto implements IPreview {
	@IsOptional()
	@IsRFC3339()
	expires?: number;

	@IsOptional()
	@IsBoolean()
	expires_only?: boolean;

	@IsArray()
	@Type(() => SectionDto)
	sections: SectionDto[];
}
