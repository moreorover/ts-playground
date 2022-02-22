import puppeteer from 'puppeteer';

async function scrapeProduct(url: string) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: ['domcontentloaded', 'networkidle2'] });

  const [el] = await page.$x('//*[@id="leftColumn"]/div[1]/h1');
  const txt = await el.getProperty('textContent');
  const title = await txt.jsonValue();

  const [el2] = await page.$x(
    '//*[@id="quotes_summary_current_data"]/div[2]/div[1]/span[2]'
  );
  const txt2 = await el2.getProperty('textContent');
  const type = await txt2.jsonValue();

  const [el3] = await page.$x(
    '//*[@id="quotes_summary_current_data"]/div[2]/div[3]/span[2]'
  );
  const txt3 = await el3.getProperty('textContent');
  const issuer = await txt3.jsonValue();

  const [el4] = await page.$x(
    '//*[@id="quotes_summary_current_data"]/div[2]/div[4]/span[2]'
  );
  const txt4 = await el4.getProperty('textContent');
  const isin = await txt4.jsonValue();

  const [el5] = await page.$x(
    '//*[@id="quotes_summary_current_data"]/div[2]/div[5]/span[2]'
  );
  const txt5 = await el5.getProperty('textContent');
  const bclass = await txt5.jsonValue();

  const [el6] = await page.$x('//*[@id="last_last"]');
  const txt6 = await el6.getProperty('textContent');
  const price = await txt6.jsonValue();

  const [el7] = await page.$x(
    '//*[@id="quotes_summary_current_data"]/div[1]/div[2]/div[1]/span[2]'
  );
  const txt7 = await el7.getProperty('textContent');
  const daily_movement = await txt7.jsonValue();

  const [el8] = await page.$x(
    '//*[@id="quotes_summary_secondary_data"]/div/ul/li[1]/span[2]'
  );
  const txt8 = await el8.getProperty('textContent');
  const morning_star_rating = await txt8.jsonValue();

  console.log({
    title,
    type,
    issuer,
    isin,
    bclass,
    price,
    daily_movement,
    morning_star_rating
  });

  browser.close();
}

scrapeProduct(
  'https://www.investing.com/funds/allan-gray-balanced-fund-c-chart'
);
