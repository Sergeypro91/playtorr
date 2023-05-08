import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MediaType } from '@app/common/types';
import { IWebTorrent } from '@app/common/interfaces';
import { WebTorrentInfoDto } from '@app/common/contracts';

@Schema({ timestamps: true })
export class WebTorrent extends Document implements IWebTorrent {
	@Prop({ required: true })
	tmdbId: string;

	@Prop({ unique: true })
	imdbId: string;

	@Prop({ required: true, enum: MediaType })
	mediaType: MediaType;

	@Prop({ required: true })
	torrentUrl: string;

	@Prop({ type: WebTorrentInfoDto })
	torrentInfo?: WebTorrentInfoDto;
}

export const WebTorrentSchema = SchemaFactory.createForClass(WebTorrent);
