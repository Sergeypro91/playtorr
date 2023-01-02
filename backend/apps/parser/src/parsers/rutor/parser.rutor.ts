import puppeteer from 'puppeteer-extra';
import stealthMode from 'puppeteer-extra-plugin-stealth';
import { ElementHandle, executablePath } from 'puppeteer';
import {
	rutorAuthBtn,
	rutorLoginBtn,
	rutorLoginField,
	rutorPasswordField,
	rutorResultPageNav,
	rutorSearchBtn,
	rutorSearchField,
	rutorSearchPage,
	rutorSortSelector,
	rutorSortSelectorElem,
	rutorTbody,
} from './parser.rutor.selectors';
import {
	ParserReturn,
	ParserTorrent,
	stepHandle,
	shouldGoNext,
} from '../utils';

export const parseRutor = async ({
	url,
	user,
	searchQuery,
	chromeDir,
}: ParserTorrent): Promise<ParserReturn> => {
	puppeteer.use(stealthMode());

	// Browser startup
	const browser = await puppeteer.launch({
		args: ['--no-sandbox'],
		// headless: false,
		ignoreHTTPSErrors: true,
		executablePath: chromeDir || executablePath(),
	});
	const page = await browser.newPage();

	// Open page
	await stepHandle(
		async () => {
			await page.goto(url, { waitUntil: 'domcontentloaded' });
		},
		browser,
		'Open page',
	);

	// Auth on tracker
	await stepHandle(
		async () => {
			const authBtnElem = await page.waitForXPath(rutorAuthBtn);
			await (authBtnElem as ElementHandle<HTMLElement>).click();

			const loginElem = await page.waitForXPath(rutorLoginField);
			const passwordElem = await page.waitForXPath(rutorPasswordField);
			const enterBtnElem = await page.waitForXPath(rutorLoginBtn);

			await loginElem.type(user.login);
			await passwordElem.type(user.password);
			await (enterBtnElem as ElementHandle<HTMLElement>).click();
		},
		browser,
		'Auth on tracker',
	);

	// Navigate to search page
	await stepHandle(
		async () => {
			const searchPageBtnElem = await page.waitForXPath(rutorSearchPage);

			await (searchPageBtnElem as ElementHandle<HTMLElement>).click();
		},
		browser,
		'Navigate to search page',
	);

	// Setup search queries
	await stepHandle(
		async () => {
			const searchFieldElem = await page.waitForXPath(rutorSearchField);
			const searchBtnElem = await page.waitForXPath(rutorSearchBtn);
			const sortSelector = await page.waitForXPath(rutorSortSelector);

			await searchFieldElem.type(searchQuery);
			await sortSelector.select(rutorSortSelectorElem);
			await (searchBtnElem as ElementHandle<HTMLElement>).click();
		},
		browser,
		'Setup search queries',
	);

	// Handling result table data
	const queryResults = [];

	await stepHandle(
		async () => {
			const checkingNextPageResultBtn = async () => {
				const tableBody = await page.waitForXPath(rutorTbody);
				let paginationList: ElementHandle<Node>;

				try {
					paginationList = await page.waitForXPath(
						rutorResultPageNav,
						{ timeout: 3000 },
					);
				} catch (error) {}

				const currPageResults = await tableBody.evaluate(
					(elem: Element) => {
						const tds = Array.from(
							elem.querySelectorAll('tr.gai, tr.tum'),
						);
						return tds.map((td) => ({
							name: (
								td.querySelector(
									'td:nth-child(2) a:nth-child(3)',
								) as HTMLAnchorElement
							).innerText,
							magnet: (
								td.querySelector(
									'td:nth-child(2) a:nth-child(2)',
								) as HTMLAnchorElement
							).href,
							size: (
								td.querySelector(
									'td:nth-last-child(2)',
								) as HTMLAnchorElement
							).innerText,
							seeders: (
								td.querySelector(
									'td:nth-last-child(1) span:nth-child(1)',
								) as HTMLAnchorElement
							).innerText.trim(),
							leeches: (
								td.querySelector(
									'td:nth-last-child(1) span:nth-last-child(1)',
								) as HTMLAnchorElement
							).innerText.trim(),
						}));
					},
				);

				queryResults.push(...currPageResults);

				if (await shouldGoNext(paginationList)) {
					await checkingNextPageResultBtn();
				}
			};
			await checkingNextPageResultBtn();
		},
		browser,
		'Handling result table data',
	);

	// Close browser
	await browser.close();

	// Return result
	return queryResults;
};