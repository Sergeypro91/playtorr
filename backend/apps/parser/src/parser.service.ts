import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetTorrentsDto, TorrentDto } from '@app/contracts';
import { parseNnm } from './parsers/nnm/parser.nnm';
import { CHROME_DIR, NNM_URL } from '@app/constants/parser/parser.constants';
import { RMQError } from 'nestjs-rmq';

@Injectable()
export class ParserService {
	constructor(private readonly configService: ConfigService) {}
	public async getTorrents({
		search,
	}: GetTorrentsDto): Promise<TorrentDto[]> {
		const user = {
			login: this.configService.get('NNM_LOGIN'),
			password: this.configService.get('NNM_PASSWORD'),
		};
		try {
			return await parseNnm({
				url: NNM_URL,
				user,
				searchQuery: search,
				chromeDir: CHROME_DIR,
			});
		} catch (error) {
			throw new RMQError(
				error.message || 'NNMParserError',
				undefined,
				HttpStatus.BAD_REQUEST,
			);
		}
	}
}
