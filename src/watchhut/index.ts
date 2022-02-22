import { writeToJson } from '../writeToJson.js';
import puppeteer from 'puppeteer-extra';
import { Browser, Page } from 'puppeteer';

async function pupFetch(page: number): Promise<string> {
  const browser: Browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const newPage: Page = await browser.newPage();

  await newPage.goto(
    `https://www.thewatchhut.co.uk/jewellery.htm?show=96&page=${page}`
    // `https://www.thewatchhut.co.uk/mens-watches.htm?show=96&page=${page}`
  );

  const html: string = await newPage.content();

  await browser.close();

  return html;
}

async function main(pageNum: number) {
  // const res = await fetchJson(pageNum);
  const res = await pupFetch(pageNum);

  writeToJson(res, `./src/watchhut/page-${pageNum}-jewellery.html`);
}

main(1);
