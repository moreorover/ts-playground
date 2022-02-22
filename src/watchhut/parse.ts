import parse, { HTMLElement } from 'node-html-parser';
import { readFileSync } from '../writeToJson';

type ParsedItem = {
  title?: string;
  url?: string;
  image?: string;
  price?: number;
  brand?: string;
  model?: string;
  upc?: string;
};

function parseElements(element: HTMLElement): HTMLElement[] | undefined {}
function parseTitle(element: HTMLElement): string | undefined {}
function parseUrl(element: HTMLElement): string | undefined {}
function parseImage(element: HTMLElement): string | undefined {}
function parsePrice(element: HTMLElement): number | undefined {}
function parseUpc(element: HTMLElement): string | undefined {}
function parseBrand(element: HTMLElement): string | undefined {}
function parseModel(element: HTMLElement): string | undefined {}

function run() {
  const html = readFileSync('./src/watchhut/page-1.html');

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

  const parsedElements: HTMLElement[] | undefined = parseElements(parsedHtml);

  if (!parsedElements?.length) throw new Error('itemsContainer is empty');

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
