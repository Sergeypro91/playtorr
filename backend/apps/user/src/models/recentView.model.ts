import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IRecentView } from '@app/interfaces/user';
import { MediaType } from '@app/interfaces';

@Schema()
export class RecentView extends Document implements IRecentView {
	@Prop({ required: true })
	tmdbId: string;

	@Prop({ required: true })
	mediaType: MediaType;
}

export const RecentViewSchema = SchemaFactory.createForClass(RecentView);
