import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
	SearchStatus,
	ISearchQuery,
	ITorrentFile,
	IPictureTorrents,
} from '@app/interfaces';

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
	leechers?: string;
}

export const TorrentFileSchema = SchemaFactory.createForClass(TorrentFile);

@Schema()
export class SearchQuery extends Document implements ISearchQuery {
	@Prop({ required: true })
	searchQuery: string;

	@Prop({ required: true })
	lastUpdate: string;

	@Prop({ required: true, enum: SearchStatus, default: SearchStatus.CREATED })
	searchStatus: SearchStatus;

	@Prop({ required: true, type: [TorrentFileSchema] })
	torrentFiles: Types.Array<TorrentFile>;
}

export const SearchQuerySchema = SchemaFactory.createForClass(SearchQuery);

@Schema()
export class PictureTorrents extends Document implements IPictureTorrents {
	@Prop({ unique: true, required: true })
	imdbId: string;

	@Prop({ required: true, type: [SearchQuerySchema] })
	searchRequests: Types.Array<SearchQuery>;
}

export const PictureTorrentsSchema =
	SchemaFactory.createForClass(PictureTorrents);
