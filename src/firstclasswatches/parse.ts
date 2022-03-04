import { parse, HTMLElement } from 'node-html-parser';
import { readFileSync, writeToJson } from '../writeToJson.js';

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

type ParsedPage = { page: number; ads: number; items: ParsedItem[] };

function parseElements(content: HTMLElement): HTMLElement[] {
  return content.querySelectorAll('a.listingproduct');
}
function parseTitle(itemElement: HTMLElement): string | undefined {
  const div: HTMLElement | null = itemElement.querySelector(
    'div.name.bold.ellipsis'
  );
  if (!div) return undefined;

  const div2: HTMLElement | null = itemElement.querySelector(
    'div.collection.ellipsis'
  );
  if (!div2) return undefined;

  const title: string = [div.innerText.trim(), div2.innerText.trim()].join(' ');
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
  if (brand.startsWith('Garmin')) return 'Garmin';
  if (brand.startsWith('Tissot')) return 'Tissot';
  if (brand.startsWith('Victorinox')) return 'Victorinox';
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

  model = model.replace('-EX-DISPLAY', '').trim();
  if (!model) return undefined;

  model = model.replace(' EX-DISPLAY', '').trim();
  if (!model) return undefined;

  model = model.replace('.EX-DISPLAY', '').trim();
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

// run();

function runs() {
  const parsedItems: ParsedItem[] = [];
  const pages: ParsedPage[] = [];

  const brands: Set<string> = new Set<string>();
  const models: Set<string> = new Set<string>();

  for (let step = 1; step <= 81; step++) {
    const page: ParsedPage = { ads: 0, items: [], page: step };

    const html = readFileSync(
      `./src/firstclasswatches/pages/page-${step}.html`
    );

    const parsedHtml: HTMLElement = parse(html);

    const parsedElements: HTMLElement[] = parseElements(parsedHtml);

    if (!parsedElements?.length) return;

    page.ads = parsedElements.length;

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
      page.items.push(item);

      if (item.brand) brands.add(item.brand);
      if (item.model) models.add(item.model);
    }

    parsedItems.push(...page.items);
    pages.push(page);

    const sortedBrands = Array.from(brands).sort((a, b) => a.localeCompare(b));
    const sortedModels = Array.from(models).sort((a, b) => a.localeCompare(b));

    writeToJson(
      JSON.stringify(parsedItems, null, 2),
      './src/firstclasswatches/parsedItems.json'
    );
    writeToJson(
      JSON.stringify(pages, null, 2),
      './src/firstclasswatches/pages.json'
    );
    writeToJson(
      JSON.stringify(sortedBrands, null, 2),
      './src/firstclasswatches/brands.json'
    );
    writeToJson(
      JSON.stringify(sortedModels, null, 2),
      './src/firstclasswatches/models.json'
    );
  }
}

runs();
