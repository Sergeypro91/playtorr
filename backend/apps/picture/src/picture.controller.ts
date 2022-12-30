import { Body, Controller } from '@nestjs/common';
import { PictureService } from './picture.service';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { PictureGetPictureData } from '@app/contracts/picture';

@Controller()
export class PictureController {
	constructor(private readonly pictureService: PictureService) {}

	@RMQValidate()
	@RMQRoute(PictureGetPictureData.topic)
	async getPictureData(
		@Body() query: PictureGetPictureData.Request,
	): Promise<PictureGetPictureData.Response> {
		return {
			mediaType: 'movie',
			backdropPath: '/9BBTo63ANSmhC4e6r62OJFuK2GL.jpg',
			budget: 220000000,
			genres: [878, 28, 12],
			tmdbId: 24428,
			imdbId: 'tt0848228',
			originalTitle: 'The Avengers',
			overview:
				'Локи, сводный брат Тора, возвращается, и в этот раз он не один. Земля на грани порабощения, и только лучшие из лучших могут спасти человечество.  Ник Фьюри, глава международной организации Щ.И.Т., собирает выдающихся поборников справедливости и добра, чтобы отразить атаку. Под предводительством Капитана Америки Железный Человек, Тор, Невероятный Халк, Соколиный глаз и Чёрная Вдова вступают в войну с захватчиком.',
			posterPath: '/7SCa2Uw4sdTkn7mGMAhq0AkSC6Y.jpg',
			productionCompanies: [
				{
					logoPath: '/hUzeosd33nzE5MCNsZxCGEKTXaQ.png',
					name: 'Marvel Studios',
				},
			],
			releaseDate: '2012-04-25',
			revenue: 1518815515,
			runtime: 137,
			releaseStatus: 'Released',
			tagline: 'Мстители должны объединиться',
			title: 'Мстители',
			video: [],
			voteAverage: 7.708,
			voteCount: 27943,
			credits: {
				cast: [],
				crew: [],
			},
			images: {
				backdrops: [],
				logos: [],
				posters: [],
			},
			lastUpdate: new Date().toISOString(),
		};
	}
}
