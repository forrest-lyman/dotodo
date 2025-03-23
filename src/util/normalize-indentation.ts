export default function normalizeIndentation(lines: any[]): any[] {
  // Get min leading spaces of non-empty lines
  const minIndent = lines
    .filter(line => line.code.trim() !== '') // ignore empty lines
    .map(line => line.code.match(/^ */)?.[0].length ?? 0)
    .reduce((min, len) => Math.min(min, len), Infinity);

  // Remove minIndent spaces from the start of each line
  return lines.map(line => ({
    ...line,
    code: line.code.slice(minIndent)
  }));
}
