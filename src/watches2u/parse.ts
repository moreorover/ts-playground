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
  detailsContainer: HTMLElement
): { brand: string; model: string } => {
  const detailsText = detailsContainer.structuredText;

  const brand = detailsContainer.querySelector('span')?.text || '';

  const model = detailsText.split(brand || '')[0];

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
      item.brand.trim() &&
      item.model.trim() &&
      item.price > 0 &&
      item.img.trim()
    )
      validCount++;
  });

  console.log(`Items received: ${items.length}. Found valid: ${validCount}`);
};

const priceCalculator = (
  priceContainer: HTMLElement,
  print: boolean
): number => {
  const reComma = new RegExp(',', 'g');
  const priceText = priceContainer?.structuredText.replace(reComma, '');

  if (print) console.log(priceText);

  const containsVoucherDiscount: boolean = priceText.includes('off use');
  const pricesSplit = priceText.split('£');

  if (containsVoucherDiscount) {
    const voucherText = pricesSplit.find((priceText) =>
      priceText.includes('off use')
    );
    const indexOfVoucherText = voucherText
      ? pricesSplit.indexOf(voucherText)
      : 0;
    const price = pricesSplit[indexOfVoucherText + 1];
    return parseFloat(price);
  }
  const price = pricesSplit[1];
  return parseFloat(price);
};

const html = readFileSync('./src/watches2u/page-3-watches.html');

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

const items: HTMLElement[] = parsedHtml.querySelectorAll(
  'a[class=xcomponent_products_medium_link]'
);

if (!items.length) throw new Error('itemsContainer is empty');

console.log('Count of itemContainers: ', items.length);

const parsedItems: ParsedItem[] = [];

for (const item of items) {
  const url = item.getAttribute('href');
  const img = item.querySelector('img')?.getAttribute('src');
  const title = item.querySelector('img')?.getAttribute('title');
  const priceContainer = item.querySelector(
    'div[class=xcomponent_products_medium_price]'
  );
  const detailsContainer = item.querySelector(
    'span[class=xcomponent_products_medium_description]'
  );
  const { brand, model } = detailsContainer
    ? detailsCalculator(detailsContainer)
    : {
        brand: '',
        model: ''
      };
  const price = priceContainer
    ? priceCalculator(priceContainer, model === 'A22104M1 ')
    : 0;

  const upc = crypto
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

// console.log(parsedItems);

for (const parsedItem of parsedItems) {
  if (parsedItem.model === 'A22104M1 ') console.log({ ...parsedItem });
}

checkItems(parsedItems);

const nextPageAvailable = (html: HTMLElement): boolean => {
  const container = html.querySelector(
    'div[class=page_search_results_subbar_right]'
  );
  const span = container?.querySelector('span');
  const spanText = span?.text;
  const spanTextSplit = spanText?.split(' ');
  const currentPage = spanTextSplit ? parseInt(spanTextSplit[1]) : -1;
  const totalPages = spanTextSplit ? parseInt(spanTextSplit[3]) : -1;

  console.log({ currentPage, totalPages });
  if (currentPage < totalPages) {
    return true;
  }
  return false;
};

console.log(
  `Next page is: ${
    nextPageAvailable(parsedHtml) ? 'available' : 'not available'
  }`
);
