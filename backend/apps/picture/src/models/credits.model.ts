import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from "mongoose";
import { ICredits } from "@app/interfaces";
import { People, PeopleSchema } from "./people.model";

@Schema()
export class Credits extends Document implements ICredits {
	@Prop({ required: true, type: [PeopleSchema] })
	cast: Types.Array<People>;


	@Prop({ required: true, type: [PeopleSchema] })
	crew: Types.Array<People>;
}

export const CreditsSchema = SchemaFactory.createForClass(Credits);
