import puppeteer from 'puppeteer-extra';
// TODO Решить вопрос с импортом стейлс плагина
// eslint-disable-next-line @typescript-eslint/no-var-requires
const hidden = require('puppeteer-extra-plugin-stealth');
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

export type ParserNnm = {
	url: string;
	user: NnmUser;
	searchQuery: string;
	chromeDir?: string;
};

export type NnmUser = {
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

const timeoutInterrupter = (
	delay: number,
	message: string,
	browser: Browser,
) => {
	return setTimeout(async () => {
		await browser.close();
		console.log(message);
	}, delay);
};

const stepHandling = async (name: string, fn: () => void, browser: Browser) => {
	const navigateToAuthPageInterrupter = timeoutInterrupter(
		DELAY,
		`Timeout exceeded on \"${name}\" step. ${DELAY} ms`,
		browser,
	);
	await fn();
	clearTimeout(navigateToAuthPageInterrupter);
};

export const parseNnm = async ({
	url,
	user,
	searchQuery,
	chromeDir,
}: ParserNnm): Promise<ParserNnmReturn> => {
	puppeteer.use(hidden());

	const browser = await puppeteer.launch({
		args: ['--no-sandbox'],
		headless: false,
		ignoreHTTPSErrors: true,
		executablePath: chromeDir || executablePath(),
	});
	const page = await browser.newPage();

	// Open page
	await stepHandling(
		'Open page',
		async () => {
			await page.goto(url, { waitUntil: 'domcontentloaded' });
			const authBtnElem = await page.waitForXPath(authBtn);
			await (authBtnElem as ElementHandle<HTMLElement>).click();
		},
		browser,
	);
	// Navigate to authorization page
	await stepHandling(
		'Navigate to authorization page',
		async () => {
			const loginElem = await page.waitForXPath(loginField);
			const passwordElem = await page.waitForXPath(passwordField);
			const enterBtnElem = await page.waitForXPath(enterBtn);
			await loginElem.type(user.login);
			await passwordElem.type(user.password);
			await (enterBtnElem as ElementHandle<HTMLElement>).click();
		},
		browser,
	);
	// Navigate to search page
	await stepHandling(
		'Navigate to search page',
		async () => {
			const toSearchPageBtnElem = await page.waitForXPath(
				toSearchPageBtn,
			);
			await (toSearchPageBtnElem as ElementHandle<HTMLElement>).click();
		},
		browser,
	);
	// Setup search queries
	await stepHandling(
		'Setup search queries',
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
	);
	// Getting search result
	await stepHandling(
		'Getting search result',
		async () => {
			const sizeTableHeaderElem = await page.waitForXPath(
				sizeTableHeader,
			);
			await (sizeTableHeaderElem as ElementHandle<HTMLElement>).click();
			await (sizeTableHeaderElem as ElementHandle<HTMLElement>).click();
		},
		browser,
	);
	// Handling result table data
	const resultingPagesUrl = [];
	await stepHandling(
		'Handling result table data',
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
					await resultPageNavElem.evaluate((elem) =>
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						elem.lastChild.click(),
					);
					await checkingNextPageResultBtn();
				}
			};
			await checkingNextPageResultBtn();
		},
		browser,
	);
	// Data collection
	const responseData = [];
	await stepHandling(
		'Data collection',
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
	);
	// Close browser
	await browser.close();
	// Return result
	return responseData;
};
