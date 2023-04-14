import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ICompany } from '@app/common';

@Schema()
export class Company extends Document implements ICompany {
	@Prop()
	logoPath?: string;

	@Prop({ required: true })
	name: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
