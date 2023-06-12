import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ITrend } from '@app/common/interfaces';
import {
	GetPictureTrendsRequestDto,
	GetPictureTrendsResponseDto,
} from '@app/common/contracts';

@Schema({ timestamps: true })
export class Trend extends Document implements ITrend {
	@Prop({ required: true, unique: true, type: GetPictureTrendsRequestDto })
	trendRequest: GetPictureTrendsRequestDto;

	@Prop({ required: true, type: GetPictureTrendsResponseDto })
	trendResponse: GetPictureTrendsResponseDto;
}

export const TrendSchema = SchemaFactory.createForClass(Trend);
