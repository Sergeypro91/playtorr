import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MediaType, IRecentView } from '@app/common';

@Schema()
export class RecentView extends Document implements IRecentView {
	@Prop({ required: true })
	tmdbId: string;

	@Prop({ required: true })
	mediaType: MediaType;
}

export const RecentViewSchema = SchemaFactory.createForClass(RecentView);
