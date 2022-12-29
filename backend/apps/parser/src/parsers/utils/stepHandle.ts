import { Browser } from 'puppeteer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { DELAY } from '../constants';

export type ParserTorrent = {
	url: string;
	user: UserTorrent;
	searchQuery: string;
	chromeDir?: string;
};

export type UserTorrent = {
	login: string;
	password: string;
};

export type ParserReturn = {
	name: string;
	size: string;
	magnet: string;
	seeders: string;
	leeches: string;
}[];

export const stepHandle = async (
	fn: () => void,
	browser: Browser,
	name?: string,
) =>
	new Promise(async (res, rej) => {
		let timeoutMessage = '';

		const timeout = setTimeout(async () => {
			timeoutMessage = `Step \"${name}\". Waiting failed: ${DELAY}ms exceeded`;
			await browser.close();
		}, DELAY);

		try {
			await fn();
		} catch (error) {
			rej(timeoutMessage || error.message);
			return;
		}

		clearTimeout(timeout);
		res(true);
	}).catch((error) => {
		throw new HttpException(
			error.message,
			error.code || HttpStatus.REQUEST_TIMEOUT,
		);
	});
