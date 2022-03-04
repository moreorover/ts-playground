import fetch from 'node-fetch';
import { writeToJson } from '../writeToJson.js';

export async function page(pageNum: number): Promise<string> {
  const response = await fetch(
    `https://www.firstclasswatches.co.uk/mens-watches/?page=${pageNum}`,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-GB,en;q=0.5',
        'Alt-Used': 'www.firstclasswatches.co.uk',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Cache-Control': 'max-age=0'
      },
      method: 'GET'
    }
  );

  return await response.text();
}

async function main(pageNum: number) {
  const results: string = await page(pageNum);
  writeToJson(results, `./src/firstclasswatches/pages/page-${pageNum}.html`);
}

for (let step = 1; step <= 81; step++) {
  console.log('step: ', step);
  main(step);
}
