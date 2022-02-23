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
  return content.querySelectorAll('a.listingproduct');
}
function parseTitle(itemElement: HTMLElement): string | undefined {
  const div: HTMLElement | null = itemElement.querySelector(
    'div.collection.ellipsis'
  );
  if (!div) return undefined;

  const title: string = div.innerText.trim();
  if (!title) return undefined;

  //   const title: string | undefined = itemElement.getAttribute('title')?.trim();
  //   if (!title) return undefined;
  return title;
}
function parseUrl(itemElement: HTMLElement): string | undefined {
  const url: string | undefined = itemElement.getAttribute('href')?.trim();
  if (!url) return undefined;
  return url;
}
function parseImage(itemElement: HTMLElement): string | undefined {
  const div: HTMLElement | null =
    itemElement.querySelector('div.noscript.image');
  if (!div) return undefined;

  const img: HTMLElement | null = div.querySelector('img');
  if (!img) return undefined;

  const url: string | undefined = img.getAttribute('data-src');
  if (!url) return undefined;

  return url;
}
function parsePrice(itemElement: HTMLElement): number | undefined {
  const content: string | undefined = itemElement
    .getAttribute('data-price')
    ?.trim();
  if (!content) return undefined;

  const price: number = parseFloat(content);
  if (!(price > 0)) return undefined;

  return price;
}
function parseUpc(itemElement: HTMLElement): string | undefined {
  const upc: string | undefined = itemElement.getAttribute('data-id')?.trim();
  if (!upc) return undefined;
  return upc;
}
function parseBrand(itemElement: HTMLElement): string | undefined {
  const brand: string | undefined = itemElement
    .getAttribute('data-brand')
    ?.trim();
  if (!brand) return undefined;
  if (brand === 'Pre-owned') return undefined;
  return brand;
}
function parseModel(itemElement: HTMLElement): string | undefined {
  const brand: string | undefined = itemElement
    .getAttribute('data-brand')
    ?.trim();
  if (!brand) return undefined;

  const div: HTMLElement | null = itemElement.querySelector(
    'div.name.bold.ellipsis'
  );
  if (!div) return undefined;

  const text: string = div.innerText.trim();
  if (!text) return undefined;

  let model: string = text.replace(brand, '').trim();
  if (!model) return undefined;

  model = model.replace('-EXDISPLAY', '').trim();
  if (!model) return undefined;

  return model;
}

function run() {
  const html = readFileSync('./src/firstclasswatches/page-1.html');

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
