import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IPictureDetail, MediaType } from '@app/interfaces';
import { Company, CompanySchema } from './company.model';
import { Season, SeasonSchema } from './season.model';
import { Video, VideoSchema } from './video.model';
import { Credits, CreditsSchema } from './credits.model';
import { Images, ImagesSchema } from './images.model';

@Schema()
export class Picture extends Document implements IPictureDetail {
	@Prop({ unique: true, required: true })
	imdbId: string;

	@Prop({ unique: true, required: true })
	tmdbId: number;

	@Prop({ required: true })
	mediaType: MediaType;

	@Prop({ required: true })
	title: string;

	@Prop({ required: true })
	originalTitle: string;

	@Prop({ required: true })
	overview: string;

	@Prop({ required: true, type: [Number] })
	genres: Types.Array<number>;

	@Prop({ required: true })
	voteAverage: number;

	@Prop({ required: true })
	voteCount: number;

	@Prop({ required: true })
	backdropPath: string;

	@Prop({ required: true })
	posterPath: string;

	@Prop({ required: true })
	releaseDate: string;

	@Prop({ required: true, type: [CompanySchema] })
	productionCompanies: Types.Array<Company>;

	@Prop({ type: [CompanySchema] })
	networks?: Types.Array<Company>;

	@Prop({ required: true })
	tagline: string;

	@Prop()
	runtime?: number;

	@Prop()
	budget?: number;

	@Prop()
	revenue?: number;

	@Prop()
	releaseStatus?: string;

	@Prop()
	inProduction?: boolean;

	@Prop({ type: [SeasonSchema] })
	seasons?: Types.Array<Season>;

	@Prop()
	seasonsCount?: number;

	@Prop()
	episodesCount?: number;

	@Prop()
	nextEpisodeDate?: string;

	@Prop({ required: true, type: [VideoSchema] })
	video: Types.Array<Video>;

	@Prop({ required: true, type: CreditsSchema })
	credits: Credits;

	@Prop({ required: true, type: ImagesSchema })
	images: Images;

	@Prop({ required: true })
	lastUpdate: string;
}

export const PictureSchema = SchemaFactory.createForClass(Picture);
