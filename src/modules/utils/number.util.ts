export function requireNumber(value: any): number {
  const number = Number(value);
  if (isNaN(number)) {
    return 0;
  }
  return number;
}