import { ElementHandle } from 'puppeteer';

export const shouldGoNext = async (paginationList: ElementHandle<Node>) => {
	if (paginationList) {
		return await paginationList.evaluate(async (elem: Element) => {
			let answer = false;
			const pages = Array.from(elem.querySelectorAll('a'));

			for (const a of pages) {
				if (a.innerHTML.match(/(след|›)/i)) {
					(a as HTMLElement).click();
					answer = true;
				}
			}

			return answer;
		});
	} else {
		return false;
	}
};
