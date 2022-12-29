import puppeteer from 'puppeteer-extra';
import stealthMode from 'puppeteer-extra-plugin-stealth';
import { executablePath, ElementHandle } from 'puppeteer';
import {
	nnmAuthBtn,
	nnmLoginField,
	nnmPasswordField,
	nnmLoginBtn,
	nnmSearchPage,
	nnmSearchField,
	nnmResetFilterBtn,
	nnmActivityFilter,
	nnmSeederExistFilter,
	nnmSearchCatSelector,
	searchCatMovie,
	searchCatTv,
	searchCatShow,
	searchCatAnime,
	nnmSearchBtn,
	nnmSortSelectorElem,
	nnmSortSelector,
	nnmTbody,
	nnmResultPageNav,
} from './parser.nnm.selectors';
import {
	ParserReturn,
	ParserTorrent,
	stepHandle,
	shouldGoNext,
} from '../utils';

export const parseNnm = async ({
	url,
	user,
	searchQuery,
	chromeDir,
}: ParserTorrent): Promise<ParserReturn> => {
	puppeteer.use(stealthMode());

	// Browser startup
	const browser = await puppeteer.launch({
		args: ['--no-sandbox'],
		// headless: false /* Its run browser when parse */,
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
			const authBtnElem = await page.waitForXPath(nnmAuthBtn);
			await (authBtnElem as ElementHandle<HTMLElement>).click();

			const loginElem = await page.waitForXPath(nnmLoginField);
			const passwordElem = await page.waitForXPath(nnmPasswordField);
			const enterBtnElem = await page.waitForXPath(nnmLoginBtn);

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
			const searchPageBtnElem = await page.waitForXPath(nnmSearchPage);

			await (searchPageBtnElem as ElementHandle<HTMLElement>).click();
		},
		browser,
		'Navigate to search page',
	);

	// Setup search queries
	await stepHandle(
		async () => {
			const searchFieldElem = await page.waitForXPath(nnmSearchField);
			const resetFilterBtnElem = await page.waitForXPath(
				nnmResetFilterBtn,
			);
			const sortSelector = await page.waitForXPath(nnmSortSelector);
			const activityFilterElem = await page.waitForXPath(
				nnmActivityFilter,
			);
			const seederExistFilterElem = await page.waitForXPath(
				nnmSeederExistFilter,
			);
			const searchCatSelectorElem = await page.waitForXPath(
				nnmSearchCatSelector,
			);
			const searchBtnElem = await page.waitForXPath(nnmSearchBtn);

			await (resetFilterBtnElem as ElementHandle<HTMLElement>).click();
			await searchFieldElem.type(searchQuery);
			await sortSelector.select(nnmSortSelectorElem);
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

	// Handling result table data
	const queryResults = [];

	await stepHandle(
		async () => {
			const checkingNextPageResultBtn = async () => {
				const tableBody = await page.waitForXPath(nnmTbody);
				let paginationList: ElementHandle<Node>;

				try {
					paginationList = await page.waitForXPath(nnmResultPageNav, {
						timeout: 3000,
					});
				} catch (error) {}

				const currPageResults = await tableBody.evaluate(
					(elem: Element) => {
						const tds = Array.from(
							elem.querySelectorAll('tr.prow1, tr.prow2'),
						);
						return tds.map((td) => ({
							name: (
								td.querySelector(
									'td:nth-child(3)',
								) as HTMLAnchorElement
							).innerText,
							magnet: (
								td.querySelector(
									'td:nth-child(5) a',
								) as HTMLAnchorElement
							).href,
							size: (
								td.querySelector(
									'td:nth-last-child(6)',
								) as HTMLAnchorElement
							).lastChild.textContent.trim(),
							seeders: (
								td.querySelector(
									'td:nth-child(8)',
								) as HTMLAnchorElement
							).innerText.trim(),
							leeches: (
								td.querySelector(
									'td:nth-child(9)',
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
