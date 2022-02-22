import fetch from 'node-fetch';
import { writeToJson } from '../writeToJson.js';
import { RootHSamuel } from './hs.types.js';

const apiUrl =
  'https://4zmivjgj4y-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.9.1)%3B%20Browser%3B%20instantsearch.js%20(4.33.2)%3B%20Vue%20(2.6.12)%3B%20Vue%20InstantSearch%20(3.7.0)%3B%20JS%20Helper%20(3.6.2)';

async function fetchByBrand(brand: string) {
  const response = await fetch(
    'https://4zmivjgj4y-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.9.1)%3B%20Browser%3B%20instantsearch.js%20(4.33.2)%3B%20Vue%20(2.6.12)%3B%20Vue%20InstantSearch%20(3.7.0)%3B%20JS%20Helper%20(3.6.2)',
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:96.0) Gecko/20100101 Firefox/96.0',
        Accept: '*/*',
        'Accept-Language': 'en-GB,en;q=0.5',
        'x-algolia-api-key': 'b00c700f18de421743f8fe6d67c7f0c8',
        'x-algolia-application-id': '4ZMIVJGJ4Y',
        'content-type': 'application/x-www-form-urlencoded',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        'Cache-Control': 'max-age=0'
      },
      referrer: 'https://www.ernestjones.co.uk/',
      body: `{"requests":[{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1000&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=true&facets=%5B%22*%22%5D&tagFilters=&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%2C%5B%22brand.lvl0%3A${brand}%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=category.lvl0&facetFilters=%5B%5B%22brand.lvl0%3A${brand}%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=brand.lvl0&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%5D"}]}`,
      method: 'POST'
    }
  );
  return await response.json();
}

async function main(brand: string): Promise<number> {
  const results = await fetchByBrand(brand);

  //   writeToJson(results as string, `${brand}.json`);

  const r: RootHSamuel = results as RootHSamuel;

  console.log({ ...r });

  const countOfHits = r.results[0].hits.length;

  console.log(`Count of hits: ${countOfHits}`);
  return countOfHits;
}

function generateBody(brand: string): string {
  const reSpace = new RegExp(' ', 'g');
  const reAnd = new RegExp('&', 'g');

  brand = brand.replace(reAnd, '%26').replace(reSpace, '%20');
  console.log(brand);

  const body = `{"requests":[{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1000&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=true&facets=%5B%22*%22%5D&tagFilters=&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%2C%5B%22brand.lvl0%3A${brand}%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=category.lvl0&facetFilters=%5B%5B%22brand.lvl0%3A${brand}%22%5D%5D"},{"indexName":"liveA_ERNEST_JONES_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=brand.lvl0&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%5D"}]}`;
  console.log('-');
  console.log(body);
  console.log('-');
  return body;
}

async function gen() {
  const brands = [
    'Tudor',
    'Montblanc',
    'Glashutte',
    'Zenith',
    'Alpina',
    'Bulova',
    'Casio',
    'Certina',
    'Citizen',
    'Hamilton',
    'Rotary',
    'Timex',
    'Tissot'
  ];
  const results = [];

  for (const brand of brands) {
    const count = await main(brand.toLowerCase());
    const body = generateBody(brand);

    count > 0 &&
      results.push({
        brand,
        count,
        url: apiUrl,
        body
      });
  }
  writeToJson(JSON.stringify(results), 'bodies.json');
}

// gen();

async function fet() {
  const res = await fetchByBrand('Hamilton');

  writeToJson(JSON.stringify(res, null, 2), 'ej-hamilton.json');
}

fet();
