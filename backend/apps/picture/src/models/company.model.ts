import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ICompany } from '@app/interfaces';

@Schema()
export class Company extends Document implements ICompany {
	@Prop({ required: true })
	logoPath: string;

	@Prop({ required: true })
	name: string;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
