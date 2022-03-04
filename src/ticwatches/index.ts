import fetch from 'node-fetch';
import { writeToJson } from '../writeToJson.js';

export async function page(pageNum: number): Promise<string> {
  const response = await await fetch(
    `https://www.ticwatches.co.uk/ajax/getProductListings?base_url=watches-c147%2Fmens-watches-c1&page_type=productlistings&page_variant=show&parent_category_id[]=1&all_upcoming_flag[]=78&keywords=&show=&sort=&page=${pageNum}&child_categories[]=1&transport=html`,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0',
        Accept: 'text/html, */*; q=0.01',
        'Accept-Language': 'en-GB,en;q=0.5',
        'X-Requested-With': 'XMLHttpRequest',
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
  writeToJson(results, `./src/ticwatches/page-${pageNum}.html`);
}

main(1);
