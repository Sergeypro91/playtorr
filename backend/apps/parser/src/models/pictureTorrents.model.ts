import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
	ISearchQueryData,
	ITorrent,
	IPictureTorrents,
	ITracker,
} from '@app/common/interfaces';
import { EnumStatus, MediaType } from '@app/common/types';

@Schema()
export class Torrent extends Document implements ITorrent {
	@Prop({ required: true })
	torrentLabel: string;

	@Prop({ required: true })
	name: string;

	@Prop()
	size?: string;

	@Prop()
	link?: string;

	@Prop()
	seeders?: string;

	@Prop()
	leeches?: string;
}

export const TorrentSchema = SchemaFactory.createForClass(Torrent);

@Schema()
export class Tracker extends Document implements ITracker {
	@Prop()
	trackerLabel: string;

	@Prop({ required: true, type: [TorrentSchema] })
	torrents: Types.Array<Torrent>;

	@Prop({ required: true, enum: EnumStatus, default: EnumStatus.CREATED })
	trackerStatus: EnumStatus;

	@Prop({ required: true })
	lastUpdate: string;

	@Prop()
	trackerMessage?: string;
}

export const TrackerSchema = SchemaFactory.createForClass(Tracker);

@Schema()
export class SearchQueryData extends Document implements ISearchQueryData {
	@Prop({ required: true })
	searchQuery: string;

	@Prop({ required: true, enum: EnumStatus, default: EnumStatus.CREATED })
	searchStatus: EnumStatus;

	@Prop({ required: true, type: [TrackerSchema] })
	trackers: Types.Array<Tracker>;
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
