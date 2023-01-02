import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ISeason } from '@app/interfaces';

@Schema()
export class Season extends Document implements ISeason {
	@Prop({ required: true })
	releaseDate: string;

	@Prop({ required: true })
	episodeCount: number;

	@Prop({ required: true })
	name: string;

	@Prop()
	overview?: string;

	@Prop()
	posterPath?: string;

	@Prop({ required: true })
	seasonNumber: number;
}

export const SeasonSchema = SchemaFactory.createForClass(Season);
