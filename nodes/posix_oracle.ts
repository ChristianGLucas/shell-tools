// INDEPENDENT ORACLE for the QuoteArgv/EscapeArg tests — NOT shell-quote,
// NOT a node, NOT a test file (no describe/it, so jest does not collect
// it). A minimal, from-scratch POSIX word-splitter written directly from
// the shell grammar rules (single-quote spans are verbatim; double-quote
// spans backslash-escape only ", \, $, `; a bare backslash outside quotes
// escapes the next character; unquoted whitespace separates words) —
// deliberately a SEPARATE implementation from shell-quote's own parse.js,
// so that a round-trip through it is evidence of correctness, not merely
// self-consistency with the library under test (per the marketplace
// seeding skill's independent-oracle requirement).
//
// Scope is intentionally narrow: this only needs to dequote the output of
// shell-quote's `quote()`, which never emits operators, redirections, or
// `$(...)`/backtick evaluation — just whitespace-separated bare/single-
// quoted/double-quoted words. It is not a general command-line parser.
export function posixSplitWords(s: string): string[] {
  const words: string[] = [];
  let i = 0;
  let cur = '';
  let sawAny = false;
  while (i < s.length) {
    const c = s[i];
    if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
      if (sawAny) {
        words.push(cur);
        cur = '';
        sawAny = false;
      }
      i += 1;
      continue;
    }
    sawAny = true;
    if (c === "'") {
      i += 1;
      while (i < s.length && s[i] !== "'") {
        cur += s[i];
        i += 1;
      }
      if (i >= s.length) throw new Error('oracle: unterminated single quote');
      i += 1; // skip closing '
      continue;
    }
    if (c === '"') {
      i += 1;
      while (i < s.length && s[i] !== '"') {
        if (s[i] === '\\' && i + 1 < s.length && ['"', '\\', '$', '`'].includes(s[i + 1])) {
          cur += s[i + 1];
          i += 2;
        } else {
          cur += s[i];
          i += 1;
        }
      }
      if (i >= s.length) throw new Error('oracle: unterminated double quote');
      i += 1; // skip closing "
      continue;
    }
    if (c === '\\' && i + 1 < s.length) {
      cur += s[i + 1];
      i += 2;
      continue;
    }
    cur += c;
    i += 1;
  }
  if (sawAny) words.push(cur);
  return words;
}
