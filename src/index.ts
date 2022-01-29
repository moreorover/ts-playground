import { getHtml } from './argos/index';

console.log('Hello world');

async function main() {
  const html = await getHtml();
  console.log(html);
}

main();
