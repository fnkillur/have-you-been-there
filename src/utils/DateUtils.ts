export function isoStringToDate(isoString: string) {
  return new Date(Date.parse(isoString));
}
