import fetch from 'node-fetch';
import { writeToJson } from '../writeToJson.js';

async function page(pageNum: number = 0): Promise<string> {
  const response = await fetch(
    `https://www.jurawatches.co.uk/collections/seiko-watches/subcat-prospex?view=ajax-brand&page=${pageNum}`,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:96.0) Gecko/20100101 Firefox/96.0',
        Accept: '*/*',
        'Accept-Language': 'en-GB,en;q=0.5',
        'X-Requested-With': 'XMLHttpRequest',
        'Alt-Used': 'www.jurawatches.co.uk',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin'
      },
      method: 'GET'
    }
  );

  return await response.text();
}

async function main(pageNum: number) {
  const results: string = await page(pageNum);
  writeToJson(results, `./src/jura/page-${pageNum}.html`);
}

main(5);

// https://www.jurawatches.co.uk/collections/seiko-watches/subcat-presage?view=ajax-brand&page=1
