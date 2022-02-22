import fetch from 'node-fetch';
import { writeToJson } from '../writeToJson.js';

async function fetJson(page: number): Promise<string> {
  const response = await await fetch(
    `https://www.thewatchhut.co.uk/mens-watches.htm?show=96&page=${page}`,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-GB,en;q=0.5',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1'
      },
      method: 'GET'
    }
  );

  return await response.text();
}

async function main(pageNum: number) {
  const res = await fetJson(pageNum);

  writeToJson(res, `./src/watchhut/page-${pageNum}.html`);
}

main(1);
