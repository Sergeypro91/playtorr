import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IPeople } from '@app/common';

@Schema()
export class People extends Document implements IPeople {
	@Prop({ required: true })
	peopleId: number;

	@Prop({ required: true })
	position: string;

	@Prop({ required: true })
	name: string;

	@Prop({ required: true })
	originalName: string;

	@Prop()
	photo?: string;

	@Prop()
	character?: string;
}

export const PeopleSchema = SchemaFactory.createForClass(People);
