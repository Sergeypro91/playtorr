import { ApiTags, ApiOperation } from '@nestjs/swagger';
import {
	Get,
	Res,
	Param,
	Controller,
	HttpException,
	Header,
} from '@nestjs/common';
import { Readable } from 'stream';
import { ConfigService } from '@nestjs/config';

@ApiTags('Image')
@Controller('image')
export class ImageController {
	constructor(private readonly configService: ConfigService) {}

	@ApiOperation({ summary: 'Получение трендов фильмов/сериалов' })
	@Get(':imageSize/:imageName')
	@Header('Cache-Control', 'max-age=3600')
	async getImage(
		@Param('imageSize') imageSize: string,
		@Param('imageName') imageName: string,
		@Res() res,
	) {
		const stream = new Readable();
		const IMAGE_URL = `${this.configService.get('TMDB_API_IMG')}`;
		const imageUrl = `${IMAGE_URL}${imageSize}/${imageName}`;

		try {
			const imageResponse = await fetch(imageUrl);
			const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

			stream.push(imageBuffer);
			stream.push(null);

			res.set('Content-Type', imageResponse.headers.get('content-type'));
			stream.pipe(res);
		} catch (error) {
			throw new HttpException(error.message, error.code);
		}
	}
}
