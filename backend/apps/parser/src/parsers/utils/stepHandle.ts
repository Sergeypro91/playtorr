import { Browser } from 'puppeteer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { STEP_DELAY } from '../constants';

export const stepHandle = async (
	fn: () => void,
	browser: Browser,
	name?: string,
) =>
	new Promise(async (res, rej) => {
		let timeoutMessage = '';

		const timeout = setTimeout(async () => {
			timeoutMessage = `Step \"${name}\". Waiting failed: ${STEP_DELAY}ms exceeded`;
			await browser.close();
		}, STEP_DELAY);

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
