import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IRecentView } from '@app/interfaces';
import { MediaType } from '@app/types';

@Schema()
export class RecentView extends Document implements IRecentView {
	@Prop({ required: true })
	tmdbId: string;

	@Prop({ required: true })
	mediaType: MediaType;
}

export const RecentViewSchema = SchemaFactory.createForClass(RecentView);
