import crypto from 'crypto';

export function generateHash(text: string): string {
  return crypto.createHash('md5').update(text).digest('hex');
}

export function removeSymbolFromText(symbol: string, text: string): string {
  const regx = new RegExp(symbol, 'g');
  return text.replace(regx, '');
}
