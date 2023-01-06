import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IVideo } from '@app/common';

@Schema()
export class Video extends Document implements IVideo {
	@Prop()
	iso?: string;

	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	key: string;

	@Prop({ required: true })
	site: string;

	@Prop({ required: true })
	size: number;

	@Prop({ required: true })
	type: string;

	@Prop({ required: true, default: false })
	official: boolean;

	@Prop({ required: true })
	publishedAt: string;
}

export const VideoSchema = SchemaFactory.createForClass(Video);
