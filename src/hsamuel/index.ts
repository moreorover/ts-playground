import fetch from 'node-fetch';
import { writeToJson } from '../writeToJson.js';

async function fetJson(page: number) {
  const x = await fetch(
    'https://4zmivjgj4y-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.9.1)%3B%20Browser%3B%20instantsearch.js%20(4.33.2)%3B%20Vue%20(2.6.12)%3B%20Vue%20InstantSearch%20(3.7.0)%3B%20JS%20Helper%20(3.6.2)',
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0',
        Accept: '*/*',
        'Accept-Language': 'en-GB,en;q=0.5',
        'x-algolia-api-key': 'b00c700f18de421743f8fe6d67c7f0c8',
        'x-algolia-application-id': '4ZMIVJGJ4Y',
        'content-type': 'application/x-www-form-urlencoded',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site'
      },
      referrer: 'https://www.hsamuel.co.uk/',
      body: '{"requests":[{"indexName":"liveB_HSAMUEL_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1000&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=true&facets=%5B%22*%22%5D&tagFilters=&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%2C%5B%22brand.lvl0%3Aseiko%22%5D%5D"},{"indexName":"liveB_HSAMUEL_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=category.lvl0&facetFilters=%5B%5B%22brand.lvl0%3Aseiko%22%5D%5D"},{"indexName":"liveB_HSAMUEL_products","params":"query=&maxValuesPerFacet=100&highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&hitsPerPage=1&facetingAfterDistinct=true&filters=display_on_website%3Atrue&clickAnalytics=false&attributesToRetrieve=%5B%5D&attributesToHighlight=%5B%5D&attributesToSnippet=%5B%5D&tagFilters=&analytics=false&facets=brand.lvl0&facetFilters=%5B%5B%22category.lvl0%3Awatches%22%5D%5D"}]}',
      method: 'POST'
    }
  );

  return await x.json();
}

async function main() {
  const res = await fetJson(1);

  writeToJson(JSON.stringify(res, null, 2), 'hs.json');
}

main();
