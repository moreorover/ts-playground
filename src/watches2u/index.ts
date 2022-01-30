import fetch from 'node-fetch';
import { writeToJson } from '../writeToJson.js';

async function page(pageNum: number = 0, itemType: string): Promise<string> {
  const response = await fetch(
    `https://www.watches2u.com/all-${itemType}.html?per_page=288&page_num=${pageNum}`,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:96.0) Gecko/20100101 Firefox/96.0',
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

async function main(pageNum: number, itemType: string) {
  const results: string = await page(pageNum, itemType);
  writeToJson(results, `./src/watches2u/page-${pageNum}-${itemType}.html`);
}

main(3, 'watches');
