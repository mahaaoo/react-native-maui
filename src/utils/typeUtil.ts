export function isInteger(number: any) {
  return typeof number === 'number' && number%1 === 0
}
