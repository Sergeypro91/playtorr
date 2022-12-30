import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IImages } from '@app/interfaces';
import { Image, ImageSchema } from './image.model';

@Schema()
export class Images extends Document implements IImages {
	@Prop({ required: true, type: [ImageSchema] })
	backdrops: Types.Array<Image>;

	@Prop({ required: true, type: [ImageSchema] })
	logos: Types.Array<Image>;

	@Prop({ required: true, type: [ImageSchema] })
	posters: Types.Array<Image>;
}

export const ImagesSchema = SchemaFactory.createForClass(Images);
