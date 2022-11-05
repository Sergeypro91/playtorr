import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetTorrentsDto, TorrentFileDto } from '@app/contracts';
import { parseNnm } from './parsers/nnm/parser.nnm';
import { CHROME_DIR, NNM_URL } from '@app/constants/parser/parser.constants';
import { RMQError } from 'nestjs-rmq';

@Injectable()
export class ParserService {
	constructor(private readonly configService: ConfigService) {}
	public async getTorrents({
		searchQuery,
	}: GetTorrentsDto): Promise<TorrentFileDto[]> {
		const user = {
			login: this.configService.get('NNM_LOGIN'),
			password: this.configService.get('NNM_PASSWORD'),
		};
		try {
			return await parseNnm({
				url: NNM_URL,
				user,
				searchQuery,
				chromeDir: CHROME_DIR,
			});
		} catch (error) {
			throw new RMQError(error.message, undefined, error.code);
		}
	}
}
