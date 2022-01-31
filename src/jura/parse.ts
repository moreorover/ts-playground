import { readFileSync } from '../writeToJson.js';
import { parse, HTMLElement } from 'node-html-parser';
import crypto from 'crypto';

type ParsedItem = {
  title: string;
  url: string;
  img: string;
  price: number;
  brand: string;
  model: string;
  upc: string;
};

const detailsCalculator = (
  itemElement: HTMLElement
): { brand: string; model: string } => {
  const brand = '';

  const model =
    itemElement.querySelector('div.product__info > p')?.innerText.trim() || '';

  return {
    brand,
    model
  };
};

const checkItems = (items: ParsedItem[]) => {
  let validCount = 0;

  items.forEach((item) => {
    if (
      item.title.trim() &&
      item.url.trim() &&
      item.model.trim() &&
      item.price > 0 &&
      item.img.trim()
    )
      validCount++;
  });

  console.log(`Items received: ${items.length}. Found valid: ${validCount}`);
};

const priceCalculator = (itemElement: HTMLElement): number => {
  const priceText = itemElement.getAttribute('data-price');
  const price = priceText && parseFloat(priceText);

  return price || -1;
};

const html = readFileSync('./src/jura/page-2.html');

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

const items: HTMLElement[] = parsedHtml.querySelectorAll('div.product');

if (!items.length) throw new Error('itemsContainer is empty');

console.log('Count of itemContainers: ', items.length);

const parsedItems: ParsedItem[] = [];

for (const item of items) {
  const url = `https://www.jurawatches.co.uk${item
    .querySelector('div.product__info > h3 > a')
    ?.getAttribute('href')}`;
  const img =
    'https:' +
    item
      .querySelector('div.product__image > a > img')
      ?.getAttribute('data-src');
  const title = item
    .querySelector('div.product__image > a > img')
    ?.getAttribute('alt')
    ?.trim();
  const { brand, model } = detailsCalculator(item);
  const price = priceCalculator(item);

  const upc =
    'JURA_' +
    crypto
      .createHash('md5')
      .update(title || '')
      .digest('hex');

  parsedItems.push({
    title: title || '',
    url: url || '',
    img: img || '',
    price,
    brand,
    model,
    upc
  });
}

console.log(parsedItems);

checkItems(parsedItems);

const nextPageAvailable = (html: HTMLElement): boolean => {
  const items = parsedHtml.querySelectorAll('div.product');
  if (items.length < 30) {
    return false;
  }
  return true;
};

console.log(
  `Next page is: ${
    nextPageAvailable(parsedHtml) ? 'available' : 'not available'
  }`
);
