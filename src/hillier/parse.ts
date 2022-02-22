import { page } from './index.js';
import { parse, HTMLElement } from 'node-html-parser';
import { readFileSync } from '../writeToJson.js';
import { removeSymbolFromText } from '../utils.js';

type ParsedItem = {
  title: string;
  url: string;
  img: string;
  price: number;
  brand: string;
  model: string;
  upc: string;
};

const priceCalculator = (itemElement: HTMLElement): number => {
  const priceElement = itemElement.querySelector(
    'div.product__details__prices'
  );
  const priceText = priceElement?.structuredText;

  if (!priceText) throw Error('price text is empty');

  const cleanText = removeSymbolFromText(',', priceText);

  const textSplit: string[] = cleanText.split('£');

  return parseFloat(textSplit[1]);
};

const html = readFileSync('./src/hillier/page-all.html');

const parsedHtml: HTMLElement = parse(html, {
  lowerCaseTagName: false, // convert tag name to lower case (hurts performance heavily)
  comment: false, // retrieve comments (hurts performance slightly)
  blockTextElements: {
    script: true, // keep text content when parsing
    noscript: true, // keep text content when parsing
    style: true, // keep text content when parsing
    pre: true // keep text content when parsing
  }
});

const items: HTMLElement[] = parsedHtml.querySelectorAll('li.col');

if (!items.length) throw new Error('itemsContainer is empty');

console.log('Count of itemContainers: ', items.length);

const parsedItems: ParsedItem[] = [];

for (const item of items) {
  const upc = item.querySelector('div.product')?.getAttribute('id');
  const img = item.querySelector('img')?.getAttribute('data-src');
  const title = item.querySelector('a')?.getAttribute('title');
  const url = item.querySelector('a')?.getAttribute('href');
  const model = item
    .querySelector('div.product')
    ?.getAttribute('data-productreference')
    ?.toUpperCase();

  const price = priceCalculator(item);

  parsedItems.push({
    title: title || '',
    url: `https://www.hillierjewellers.co.uk${url}`,
    img: `https://www.hillierjewellers.co.uk${img}`,
    price,
    brand: '',
    model: model || '',
    upc: upc || ''
  });
}

console.log(parsedItems);

// max per page 60 items

const nextPageAvailable = (html: HTMLElement): boolean => {
  const items = html.querySelectorAll('li.col');
  console.log('Items cound: ', items.length);
  if (items.length < 60) {
    return false;
  }
  return true;
};

console.log(
  `Next page is: ${
    nextPageAvailable(parsedHtml) ? 'available' : 'not available'
  }`
);
