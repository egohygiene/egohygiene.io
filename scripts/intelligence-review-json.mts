import { TextDecoder } from "node:util";

/** Decode an untrusted review transport without last-key-wins admission.
 * This is syntax admission only; owner/source admission follows separately. */
export function decodeReviewJson(bytes: Uint8Array): unknown {
  const requireSyntax: (condition: unknown) => asserts condition = (condition) => {
    if (!condition) throw new Error("Review JSON is incompatible");
  };
  requireSyntax(bytes.byteLength > 0 && bytes.byteLength <= 16 * 1024 * 1024);
  let source: string;
  try { source = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(bytes); }
  catch { throw new Error("Review JSON is incompatible"); }
  let offset = 0;
  let nodes = 0;
  const space = (): void => { while (offset < source.length && /[ \t\r\n]/.test(source[offset]!)) offset += 1; };
  const string = (): string => {
    requireSyntax(source[offset] === '"');
    const start = offset++;
    while (offset < source.length) {
      const character = source[offset++]!;
      if (character === "\\") {
        requireSyntax(offset < source.length);
        offset += 1;
      } else if (character === '"') {
        let result: unknown;
        try { result = JSON.parse(source.slice(start, offset)); }
        catch { throw new Error("Review JSON is incompatible"); }
        requireSyntax(typeof result === "string");
        // Paired astral characters iterate as one code point. Lone UTF-16
        // surrogates cannot appear in an interoperable UTF-8 owner artifact.
        for (const point of result) {
          const code = point.codePointAt(0)!;
          requireSyntax(code < 0xd800 || code > 0xdfff);
        }
        return result;
      } else requireSyntax(character.charCodeAt(0) >= 0x20);
    }
    throw new Error("Review JSON is incompatible");
  };
  const value = (depth: number): unknown => {
    nodes += 1;
    requireSyntax(depth <= 64 && nodes <= 100000);
    space();
    if (source[offset] === '"') return string();
    if (source[offset] === "{") {
      offset += 1;
      const result: Record<string, unknown> = {};
      const keys = new Set<string>();
      space();
      if (source[offset] === "}") { offset += 1; return result; }
      for (;;) {
        space();
        const key = string();
        requireSyntax(!keys.has(key)); keys.add(key);
        space(); requireSyntax(source[offset++] === ":");
        Object.defineProperty(result, key, { value: value(depth + 1), enumerable: true, writable: true, configurable: true });
        space();
        const delimiter = source[offset++];
        if (delimiter === "}") return result;
        requireSyntax(delimiter === ",");
      }
    }
    if (source[offset] === "[") {
      offset += 1;
      const result: unknown[] = [];
      space();
      if (source[offset] === "]") { offset += 1; return result; }
      for (;;) {
        requireSyntax(result.length < 16384);
        result.push(value(depth + 1)); space();
        const delimiter = source[offset++];
        if (delimiter === "]") return result;
        requireSyntax(delimiter === ",");
      }
    }
    for (const [literal, result] of [["true", true], ["false", false], ["null", null]] as const) {
      if (source.startsWith(literal, offset)) { offset += literal.length; return result; }
    }
    const number = /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/.exec(source.slice(offset));
    requireSyntax(number !== null);
    offset += number[0].length;
    const result = Number(number[0]); requireSyntax(Number.isFinite(result));
    return result;
  };
  const result = value(0);
  space(); requireSyntax(offset === source.length);
  return result;
}
