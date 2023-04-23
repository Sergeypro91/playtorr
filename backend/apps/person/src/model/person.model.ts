import { now, Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IPerson, IPersonPicture } from '@app/common/interfaces/person';
import { MediaType } from '@app/common/types';

@Schema()
export class PersonPicture implements IPersonPicture {
	@Prop()
	tmdbId?: string;

	@Prop()
	imdbId?: string;

	@Prop({ enum: MediaType })
	mediaType?: MediaType;
}

export const PersonPictureSchema = SchemaFactory.createForClass(PersonPicture);

@Schema({ timestamps: true })
export class Person extends Document implements IPerson {
	@Prop({ required: true, type: [PersonPictureSchema], default: [] })
	movies: Types.Array<PersonPicture>;

	@Prop({ required: true, type: [PersonPictureSchema], default: [] })
	tvs: Types.Array<PersonPicture>;

	@Prop({ required: true, unique: true })
	tmdbId: string;

	@Prop({ unique: true })
	imdbId?: string;

	@Prop()
	photo?: string;

	@Prop()
	birthday?: string;

	@Prop()
	name?: string;

	@Prop()
	biography?: string;
}

export const PersonSchema = SchemaFactory.createForClass(Person);
