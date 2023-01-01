import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IImage } from '@app/interfaces';

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

	@Prop({ required: true })
	voteAverage: number;

	@Prop({ required: true })
	voteCount: number;

	@Prop({ required: true })
	width: number;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
