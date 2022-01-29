import fs from 'fs';

export function writeToJson(text: string, fileName: string): void {
  fs.writeFile(fileName, text, (err) => {
    if (err) {
      throw err;
    }
    console.log('Data is saved.');
  });
}

export function readFileSync(pathToFile: string): string {
  return fs.readFileSync(pathToFile, 'utf-8');
}
