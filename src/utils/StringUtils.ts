export function priceAddComma(price: string | number) {
  return price.toString();
}

export function makeKeywords(result: string[], char: string): string[] {
  if (!char.trim()) {
    return result;
  }

  return result.concat(`${result[result.length - 1] || ''}${char.trim()}`);
}
