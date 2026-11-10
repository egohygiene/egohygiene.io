/** Reject ASCII controls without relying on control-character regex literals. */
export function hasAsciiControl(value: string): boolean {
  return Array.from(value).some((character) => {
    const code = character.charCodeAt(0);
    return code < 0x20 || code === 0x7f;
  });
}
