import {
	IsArray,
	IsBoolean,
	IsDate,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BasePictureDto } from '../../base.dto';

export class GetTorrentDistributionInfoDto extends BasePictureDto {
	@IsString()
	torrentUrl: string;
}

export class TorrentDistributionDto {
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
}

export class TorrentDistributionInfoDto {
	@IsString()
	name: string;

	@IsNumber()
	length: number;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => TorrentDistributionDto)
	files: TorrentDistributionDto[];

	@IsDate()
	created: Date;
}
