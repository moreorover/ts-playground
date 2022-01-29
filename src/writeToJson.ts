import fs from 'fs';

export function writeToJson(text: string, fileName: string): void {
  fs.writeFile(fileName, text, (err) => {
    if (err) {
      throw err;
    }
    console.log('Data is saved.');
  });
}
