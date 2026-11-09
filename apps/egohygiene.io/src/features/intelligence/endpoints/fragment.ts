/** Exact reversible UTF-16 encoding, shared by server IDs and navigable fragments. */
export function endpointFragment(value: string): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  let accumulator = 0;
  let bits = 0;
  let result = "e-";
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    for (const byte of [code >> 8, code & 255]) {
      accumulator = (accumulator << 8) | byte;
      bits += 8;
      while (bits >= 6) {
        bits -= 6;
        result += alphabet[(accumulator >> bits) & 63];
      }
      accumulator &= (1 << bits) - 1;
    }
  }
  if (bits) result += alphabet[(accumulator << (6 - bits)) & 63];
  return result;
}
