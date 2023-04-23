import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MediaType } from '@app/common/types';
import { IPicture } from '@app/common/interfaces';
import { MovieDto, TvDto } from '@app/common/contracts';

@Schema({ timestamps: true })
export class Picture extends Document implements IPicture {
	@Prop({ required: true })
	tmdbId: string;

	@Prop({ unique: true })
	imdbId: string | null;

	@Prop({ required: true })
	mediaType: MediaType;

	@Prop({ type: MovieDto || TvDto })
	pictureData: MovieDto | TvDto;
}

export const PictureSchema = SchemaFactory.createForClass(Picture);
