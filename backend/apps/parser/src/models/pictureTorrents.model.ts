import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
	ISearchQueryData,
	ITorrentFile,
	IPictureTorrents,
	ITorrent,
} from '@app/interfaces';
import { EnumStatus, MediaType } from '@app/types';

@Schema()
export class TorrentFile extends Document implements ITorrentFile {
	@Prop({ required: true })
	torrentLabel: string;

	@Prop({ required: true })
	name: string;

	@Prop()
	size?: string;

	@Prop()
	magnet?: string;

	@Prop()
	seeders?: string;

	@Prop()
	leeches?: string;
}

export const TorrentFileSchema = SchemaFactory.createForClass(TorrentFile);

@Schema()
export class Torrent extends Document implements ITorrent {
	@Prop()
	torrentLabel: string;

	@Prop({ required: true, type: [TorrentFileSchema] })
	torrentFiles: Types.Array<TorrentFile>;

	@Prop({ required: true, enum: EnumStatus, default: EnumStatus.CREATED })
	torrentStatus: EnumStatus;

	@Prop()
	torrentStatusMessage?: string;
}

export const TorrentSchema = SchemaFactory.createForClass(Torrent);

@Schema()
export class SearchQueryData extends Document implements ISearchQueryData {
	@Prop({ required: true })
	searchQuery: string;

	@Prop({ required: true })
	lastUpdate: string;

	@Prop({ required: true, enum: EnumStatus, default: EnumStatus.CREATED })
	searchStatus: EnumStatus;

	@Prop({ required: true, type: [TorrentSchema] })
	torrents: Types.Array<Torrent>;
}

export const SearchQueryDataSchema =
	SchemaFactory.createForClass(SearchQueryData);

@Schema()
export class PictureTorrents extends Document implements IPictureTorrents {
	@Prop({ unique: true, required: true })
	imdbId: string;

	@Prop({ required: true })
	tmdbId: string;

	@Prop({ required: true })
	mediaType: MediaType;

	@Prop({ required: true, type: [SearchQueryDataSchema] })
	searchRequests: Types.Array<SearchQueryData>;
}

export const PictureTorrentsSchema =
	SchemaFactory.createForClass(PictureTorrents);
