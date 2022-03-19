import fetch from 'node-fetch';
import { writeToJson } from '../../writeToJson.js';
import { parse, HTMLElement } from 'node-html-parser';

const basePath = './src/domashno/';

async function fetchHtml(lesson: string) {
  const result = await fetch(`https://domashno.bg/${lesson}`, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0',
      Cookie:
        'remember_web_59ba36addc2b2f9401580f014c7f58ea4e30989d=eyJpdiI6IlZaYnQraGZoQzhZTXRzSnljU3J1SVE9PSIsInZhbHVlIjoiU01LVHBcL1VkUGRKUVRUVzluc2E5UHpOSjF0ODNWUmlvQVhYODhGQ0c2dnJLUDVXTER5Z2FXSk9uTE5VVzBURFwvbEhGZXBpS1dBR1J1R0tLWE1GVXNzOWxSOUc2Z1Q0SFpLVEkya29iUWNDMD0iLCJtYWMiOiI3NjJjMTcwZjlmOTY4ZGIwOWU5MzVkYTE0NmNjOWI4MWEwZTMzNWJmNDkzNjY2MzU2NDViZjRhOGQxNTI4MGU1In0%3D; XSRF-TOKEN=eyJpdiI6InY4SkF2a3I2V0ljaHJGckpva1E3WWc9PSIsInZhbHVlIjoiQUJ0N3RGSkhkQnBVVkx0ZXBPOG00ODBkUVVRSUlxRjZJNUZ0d1NUVndiOWU2REE0b2Uxa3JWWkVJaDM5RWV4UTVnaG05dkNjck15VHNxUTBWTG5kenc9PSIsIm1hYyI6Ijc5NWRhMjIwNDAwNDQwY2QwOTJlZWRiZmNiN2JkZTVlZGFkMzg0MGUyMjAwMzQ2ZGU3OThmMTg2NWZiOTQxOGQifQ%3D%3D; laravel_session=eyJpdiI6InZUUjZKNjJDWkluSUw3V3FCaVM2MFE9PSIsInZhbHVlIjoidXhSTFJtQWdXSFN2dmZld01mRWhtOStVbjRUQ3lyQW1HUThFOTZ1RHpLV3M2NlROVmpQMzlTajRuRCsrdWYwVE04Q1hHcVJXVkFqMVF1ajc0M3FkeHc9PSIsIm1hYyI6ImY5YWMyODRhY2Q1NzEzMmQ1MTRhNDYwZTU3Yzc2MmU3NmNhM2E5YTZjYmQ2Yzc3OGQyZDJmYTgzMzVmYmJiNzgifQ%3D%3D',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-GB,en;q=0.5',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'cross-site'
    },
    method: 'GET'
  });

  return result.text();
}

async function main() {
  const html = await fetchHtml('matematika');

  writeToJson(html, `./src/domashno/maths/index.html`);
}

type Book = {
  url: string;
  img: string;
  title: string;
};

type Year = {
  title: number | string;
  books: Book[];
};

type Result = {
  topic: string;
  years: Year[];
};

async function parseData() {
  const topics = [
    { lesson: 'maths', url: 'matematika' },
    { lesson: 'physics', url: 'fizika' },
    { lesson: 'chemistry', url: 'himiq' }
  ];

  const results: Result[] = [];

  for (const t of topics) {
    const html = await fetchHtml(t.url);
    const parsedHtml = parse(html);

    const cards = parsedHtml.querySelectorAll(
      'div.card.card-body.shadow.my-2.p-0'
    );

    const years: Year[] = [];

    cards.forEach((c) => {
      const collapseButton = c.querySelector(
        'div.rounded-lg.p-4.text-blue.font-weight-600.cursor-pointer.bg-white.d-flex.justify-content-between.align-items-center'
      );

      const text = collapseButton?.querySelector('span')?.text;
      const classYear = text?.split(' ')[0] || '-1';

      const year: Year = { title: parseInt(classYear), books: [] };

      const bookDivs = c.querySelectorAll(
        'a.d-flex.flex-column.position-relative.text-center.m-2'
      );

      bookDivs?.forEach((bd) => {
        const bookUrl = bd.getAttribute('href');

        const bookImg = bd.querySelector('img')?.getAttribute('src');
        const bookTitle = bd.querySelector('span')?.text || '';

        bookUrl &&
          bookImg &&
          year.books.push({ url: bookUrl, img: bookImg, title: bookTitle });
      });

      years.push(year);

      results.push({ topic: t.lesson, years });
    });
  }

  writeToJson(JSON.stringify(results, null, 2), basePath + 'books2.json');
}

parseData();
