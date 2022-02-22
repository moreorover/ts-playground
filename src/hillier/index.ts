import fetch from 'node-fetch';
import { writeToJson } from '../writeToJson.js';

export async function page(pageNum: number): Promise<string> {
  const response = await fetch(
    `https://www.hillierjewellers.co.uk/ajax/getProductListings?base_url=seiko-prospex-m3&page_type=productlistings&page_variant=show&manufacturer_id[]=3&all_upcoming_flag[]=78&keywords=&show=&sort=&page=${pageNum}&transport=html`,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:96.0) Gecko/20100101 Firefox/96.0',
        Accept: 'text/html, */*; q=0.01',
        'Accept-Language': 'en-GB,en;q=0.5',
        'X-Requested-With': 'XMLHttpRequest',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin'
      },
      referrer: 'https://www.hillierjewellers.co.uk/seiko-prospex-m3',
      method: 'GET'
    }
  );

  return await response.text();
}

export async function allInPage(): Promise<string> {
  const response = await fetch(
    'https://www.hillierjewellers.co.uk/ajax/getProductListings?base_url=seiko-prospex-m3&manufacturer_id[]=3&show=all&page=1&transport=html',
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:96.0) Gecko/20100101 Firefox/96.0',
        Accept: 'text/html, */*; q=0.01',
        'Accept-Language': 'en-GB,en;q=0.5',
        'X-Requested-With': 'XMLHttpRequest',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin'
      },
      referrer: 'https://www.hillierjewellers.co.uk/seiko-prospex-m3',
      method: 'GET'
    }
  );

  return await response.text();
}

async function main(pageNum: number) {
  const results: string = await page(pageNum);
  writeToJson(results, `./src/hillier/page-${pageNum}.html`);
}

async function all() {
  const results: string = await allInPage();
  writeToJson(results, `./src/hillier/page-all.html`);
}

all();
