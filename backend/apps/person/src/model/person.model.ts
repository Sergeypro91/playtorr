import { now, Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IPerson } from '@app/common/interfaces/person';

@Schema({ timestamps: true })
export class Person extends Document implements IPerson {
	@Prop({ required: true, type: [String], default: [] })
	movies: Types.Array<string>;

	@Prop({ required: true, type: [String], default: [] })
	shows: Types.Array<string>;

	@Prop({ required: true, default: now().toISOString() })
	lastUpdate: string;

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
