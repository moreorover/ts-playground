import { parse, HTMLElement } from 'node-html-parser';
import { readFileSync } from '../writeToJson.js';

const parseOptions = {
  lowerCaseTagName: false, // convert tag name to lower case (hurts performance heavily)
  comment: true, // retrieve comments (hurts performance slightly)
  blockTextElements: {
    script: true, // keep text content when parsing
    noscript: true, // keep text content when parsing
    style: true, // keep text content when parsing
    pre: true // keep text content when parsing
  }
};

const baseUrl: string = 'https://www.thewatchhut.co.uk';

type ParsedItem = {
  title?: string;
  url?: string;
  image?: string;
  price?: number;
  brand?: string;
  model?: string;
  upc?: string;
};

function parseElements(content: HTMLElement): HTMLElement[] {
  return content.querySelectorAll('div.match');
}
function parseTitle(itemElement: HTMLElement): string | undefined {
  const div: HTMLElement | null = itemElement.querySelector(
    '.productTitle.plp-truncate'
  );
  if (!div) return undefined;
  const title: string = div.text.trim();
  if (!title) return undefined;
  return title;
}
function parseUrl(itemElement: HTMLElement): string | undefined {
  const a: HTMLElement | null = itemElement.querySelector('a');
  if (!a) return undefined;
  const url: string | undefined = a.getAttribute('href');
  if (!url) return undefined;
  return `${baseUrl}${url}`;
}
function parseImage(itemElement: HTMLElement): string | undefined {
  const a: HTMLElement | null = itemElement.querySelector('a');
  if (!a) return undefined;
  const div: HTMLElement | null = a.querySelector('div');
  if (!div) return undefined;

  const url: string | undefined = div.getAttribute('data-img-src');
  if (!url) return undefined;

  return `${baseUrl}${url}`;
}
function parsePrice(itemElement: HTMLElement): number | undefined {
  const div: HTMLElement | null = itemElement.querySelector(
    'div.priceNowLarge.current'
  );
  if (!div) return undefined;

  const content: string | undefined = div.getAttribute('content')?.trim();
  if (!content) return undefined;

  const price: number = parseFloat(content);
  if (!(price > 0)) return undefined;

  return price;
}
function parseUpc(itemElement: HTMLElement): string | undefined {
  const productText: HTMLElement | null =
    itemElement.querySelector('div.product-text');
  if (!productText) return undefined;

  const meta: HTMLElement | null = productText.querySelector(
    'meta[itemprop=productID]'
  );
  if (!meta) return undefined;

  const upc: string | undefined = meta.getAttribute('content')?.trim();
  if (!upc) return undefined;

  return upc;
}
function parseBrand(itemElement: HTMLElement): string | undefined {
  const div: HTMLElement | null = itemElement.querySelector(
    'div[itemprop=brand]'
  );
  if (!div) return undefined;

  const meta: HTMLElement | null = div.querySelector('meta[itemprop=name]');
  if (!meta) return undefined;

  const upc: string | undefined = meta.getAttribute('content')?.trim();
  if (!upc) return undefined;

  return upc;
}
function parseModel(itemElement: HTMLElement): string | undefined {
  const productText: HTMLElement | null =
    itemElement.querySelector('div.product-text');
  if (!productText) return undefined;

  const meta: HTMLElement | null =
    productText.querySelector('meta[itemprop=mpn]');
  if (!meta) return undefined;

  const model: string | undefined = meta.getAttribute('content')?.trim();
  if (!model) return undefined;

  return model;
}

function run() {
  const html = readFileSync('./src/watchhut/page-1-jewellery.html');

  const parsedHtml: HTMLElement = parse(html);

  const parsedElements: HTMLElement[] = parseElements(parsedHtml);

  if (!parsedElements?.length) throw Error('itemsContainer is empty');

  console.log('Count of itemContainers: ', parsedElements.length);

  const parsedItems: ParsedItem[] = [];

  for (const element of parsedElements) {
    const item: ParsedItem = {
      title: parseTitle(element),
      upc: parseUpc(element),
      url: parseUrl(element),
      image: parseImage(element),
      price: parsePrice(element),
      brand: parseBrand(element),
      model: parseModel(element)
    };
    parsedItems.push(item);

    console.log({ ...item });
  }
}

run();
