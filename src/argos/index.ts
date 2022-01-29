import fetch, { Response } from 'node-fetch';
import fs from 'fs';

export async function getHtml(): Promise<string> {
  const response: Response = await fetch(
    'https://www.argos.co.uk/browse/jewellery-and-watches/watches/mens-watches/c:29307/opt/page:1/',
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

async function main() {
  const html = await getHtml();
  console.log(html);
}

main();
