import puppeteer from 'puppeteer-extra';
import stealthMode from 'puppeteer-extra-plugin-stealth';
import { executablePath, ElementHandle, Browser } from 'puppeteer';
import {
	authBtn,
	loginField,
	passwordField,
	enterBtn,
	toSearchPageBtn,
	searchField,
	resetFilterBtn,
	activityFilter,
	seederExistFilter,
	searchCatSelector,
	searchCatMovie,
	searchCatTv,
	searchCatShow,
	searchCatAnime,
	searchBtn,
	sizeTableHeader,
	resultPageNav,
	torrentName,
	torrentSize,
	torrentFile,
	torrentSeeders,
	torrentLeechers,
} from './parser.nnm.selectors';
import { LABEL, DELAY } from './parser.nnm.constants';
import { HttpException, HttpStatus } from '@nestjs/common';

export type ParserNnm = {
	url: string;
	user: UserNnm;
	searchQuery: string;
	chromeDir?: string;
};

export type UserNnm = {
	login: string;
	password: string;
};

export type ParserNnmReturn = {
	torrentLabel: string;
	name: string;
	size: string;
	magnet: string;
	seeders: string;
	leechers: string;
}[];

const stepHandling = async (fn: () => void, browser: Browser, name?: string) =>
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

export const parseNnm = async ({
	url,
	user,
	searchQuery,
	chromeDir,
}: ParserNnm): Promise<ParserNnmReturn> => {
	puppeteer.use(stealthMode());

	// Browser startup
	const browser = await puppeteer.launch({
		args: ['--no-sandbox'],
		headless: false,
		ignoreHTTPSErrors: true,
		executablePath: chromeDir || executablePath(),
	});
	const page = await browser.newPage();

	// Open page
	await stepHandling(
		async () => {
			await page.goto(url, { waitUntil: 'domcontentloaded' });
			const authBtnElem = await page.waitForXPath(authBtn);
			await (authBtnElem as ElementHandle<HTMLElement>).click();
		},
		browser,
		'Open page',
	);

	// Navigate to authorization page
	await stepHandling(
		async () => {
			const loginElem = await page.waitForXPath(loginField);
			const passwordElem = await page.waitForXPath(passwordField);
			const enterBtnElem = await page.waitForXPath(enterBtn);
			await loginElem.type(user.login);
			await passwordElem.type(user.password);
			await (enterBtnElem as ElementHandle<HTMLElement>).click();
		},
		browser,
		'Navigate to authorization page',
	);

	// Navigate to search page
	await stepHandling(
		async () => {
			const toSearchPageBtnElem = await page.waitForXPath(
				toSearchPageBtn,
			);
			await (toSearchPageBtnElem as ElementHandle<HTMLElement>).click();
		},
		browser,
		'Navigate to search page',
	);

	// Setup search queries
	await stepHandling(
		async () => {
			const searchFieldElem = await page.waitForXPath(searchField);
			const resetFilterBtnElem = await page.waitForXPath(resetFilterBtn);
			const activityFilterElem = await page.waitForXPath(activityFilter);
			const seederExistFilterElem = await page.waitForXPath(
				seederExistFilter,
			);
			const searchCatSelectorElem = await page.waitForXPath(
				searchCatSelector,
			);
			const searchBtnElem = await page.waitForXPath(searchBtn);
			await (resetFilterBtnElem as ElementHandle<HTMLElement>).click();
			await searchFieldElem.type(searchQuery);
			await (activityFilterElem as ElementHandle<HTMLElement>).click();
			await (seederExistFilterElem as ElementHandle<HTMLElement>).click();
			await searchCatSelectorElem.select(
				...searchCatMovie,
				...searchCatTv,
				...searchCatShow,
				...searchCatAnime,
			);
			await (searchBtnElem as ElementHandle<HTMLElement>).click();
		},
		browser,
		'Setup search queries',
	);

	// Getting search result
	await stepHandling(
		async () => {
			const sizeTableHeaderElem = await page.waitForXPath(
				sizeTableHeader,
			);
			await (sizeTableHeaderElem as ElementHandle<HTMLElement>).click();
			await (sizeTableHeaderElem as ElementHandle<HTMLElement>).click();
		},
		browser,
		'Getting search result',
	);

	// Handling result table data
	const resultingPagesUrl = [];
	await stepHandling(
		async () => {
			const checkingNextPageResultBtn = async () => {
				const resultPageNavElem = await page.waitForXPath(
					resultPageNav,
				);
				const nextPageTitle = await resultPageNavElem.evaluate(
					(elem) => elem?.lastChild?.textContent || null,
				);
				const currResultPagesUrl = await page.evaluate(() => {
					const rowsElem = document.querySelectorAll('.topictitle');
					return Object.values(rowsElem).map(
						(elem: HTMLAnchorElement) => elem.href,
					);
				});

				resultingPagesUrl.push(...currResultPagesUrl);

				if (nextPageTitle && nextPageTitle.match(/след/i)) {
					const nextBtn = (await resultPageNavElem.evaluate(
						(elem) => elem.lastChild,
					)) as HTMLElement;
					nextBtn.click();
					await checkingNextPageResultBtn();
				}
			};
			await checkingNextPageResultBtn();
		},
		browser,
		'Handling result table data',
	);

	// Data collection
	const responseData = [];
	await stepHandling(
		async () => {
			for (let i = 0; i < resultingPagesUrl.length; i++) {
				await page.goto(resultingPagesUrl[i], {
					waitUntil: 'domcontentloaded',
				});
				const torrentNameElem = await page.waitForXPath(torrentName);
				const torrentSizeElem = await page.waitForXPath(torrentSize);
				const torrentFileElem = await page.waitForXPath(torrentFile);
				const torrentSeedersElem = await page.waitForXPath(
					torrentSeeders,
				);
				const torrentLeechersElem = await page.waitForXPath(
					torrentLeechers,
				);
				const name = await torrentNameElem.evaluate(
					(elem) => elem.textContent,
				);
				const size = await torrentSizeElem.evaluate(
					(elem) => elem.textContent,
				);
				const magnet = await torrentFileElem.evaluate(
					(elem: HTMLAnchorElement) => elem.href,
				);
				const seeders = await torrentSeedersElem.evaluate(
					(elem) => elem.textContent.match(/\d+/)[0],
				);
				const leechers = await torrentLeechersElem.evaluate(
					(elem) => elem.textContent.match(/\d+/)[0],
				);
				responseData.push({
					torrentLabel: LABEL,
					name,
					size,
					magnet,
					seeders,
					leechers,
				});
			}
		},
		browser,
		'Data collection',
	);

	// Close browser
	await browser.close();

	// Return result
	return responseData;
};
