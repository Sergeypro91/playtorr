import puppeteer from 'puppeteer-extra';
import stealthMode from 'puppeteer-extra-plugin-stealth';
import { executablePath, ElementHandle } from 'puppeteer';
import {
	rutrackerAuthBtn,
	rutrackerLoginField,
	rutrackerPasswordField,
	rutrackerLoginBtn,
	rutrackerSearchPageBtn,
	rutrackerSearchField,
	rutrackerSearchFieldBtn,
	rutrackerSortSelector,
	rutrackerSortSelectorElem,
	rutrackerSearchFieldBtnSecond,
	rutrackerPaginationList,
	rutrackerTbody,
} from './parser.ruTracker.selectors';
import {
	ParserReturn,
	ParserTorrent,
	stepHandle,
	shouldGoNext,
} from '../utils';

export const parseRuTracker = async ({
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
			const authBtnElem = await page.waitForXPath(rutrackerAuthBtn);
			await (authBtnElem as ElementHandle<HTMLElement>).click();

			const loginElem = await page.waitForXPath(rutrackerLoginField);
			const passwordElem = await page.waitForXPath(
				rutrackerPasswordField,
			);
			const enterBtnElem = await page.waitForXPath(rutrackerLoginBtn);

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
			const toSearchPageBtnElem = await page.waitForXPath(
				rutrackerSearchPageBtn,
			);

			await (toSearchPageBtnElem as ElementHandle<HTMLElement>).click();
		},
		browser,
		'Navigate to search page',
	);

	// Setup search queries
	await stepHandle(
		async () => {
			const searchFieldElem = await page.waitForXPath(
				rutrackerSearchField,
			);
			const searchBtnElem = await page.waitForXPath(
				rutrackerSearchFieldBtn,
			);

			await searchFieldElem.type(searchQuery);
			await (searchBtnElem as ElementHandle<HTMLElement>).click();

			const sortSelector = await page.waitForXPath(rutrackerSortSelector);
			const searchBtnSecondElem = await page.waitForXPath(
				rutrackerSearchFieldBtnSecond,
			);

			await sortSelector.select(rutrackerSortSelectorElem);
			await (searchBtnSecondElem as ElementHandle<HTMLElement>).click();
		},
		browser,
		'Setup search queries',
	);

	// Handling result table data
	const queryResults = [];

	await stepHandle(
		async () => {
			const checkingNextPageResultBtn = async () => {
				const tableBody = await page.waitForXPath(rutrackerTbody);
				let paginationList: ElementHandle<Node>;

				try {
					paginationList = await page.waitForXPath(
						rutrackerPaginationList,
						{ timeout: 3000 },
					);
				} catch (error) {}

				const currPageResults = await tableBody.evaluate(
					(elem: Element) => {
						const tds = Array.from(
							elem.querySelectorAll('tr.tCenter'),
						);

						return tds.map((td: HTMLElement) => ({
							name: (
								td.querySelector(
									'td:nth-child(4)',
								) as HTMLElement
							).innerText,
							magnet: (
								td.querySelector(
									'td:nth-child(6) a',
								) as HTMLAnchorElement
							).href,
							size: (
								td.querySelector(
									'td:nth-child(6) a',
								) as HTMLElement
							).innerText.replace(' ↓', ''),
							seeders: (
								td.querySelector(
									'td:nth-child(7)',
								) as HTMLElement
							).innerText,
							leeches: (
								td.querySelector(
									'td:nth-child(8)',
								) as HTMLElement
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
