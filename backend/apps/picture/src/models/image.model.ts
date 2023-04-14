import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IImage } from '@app/common';

@Schema()
export class Image extends Document implements IImage {
	@Prop({ required: true })
	aspectRatio: number;

	@Prop({ required: true })
	height: number;

	@Prop()
	iso?: string;

	@Prop()
	filePath?: string;

	@Prop({ required: true, default: 0 })
	voteAverage: number;

	@Prop({ required: true, default: 0 })
	voteCount: number;

	@Prop({ required: true })
	width: number;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
