// Static source audit, not a node test for a specific node — but jest
// collects every nodes/**/*_test.ts file (see jest.config.js), so this runs
// on every `axiom test` invocation just like the per-node suites.
//
// This package's entire premise is "parse and construct shell command-line
// STRINGS — never execute anything." That claim is enforced here as a
// running test, not just documentation: it greps every source file this
// package ships (nodes/*.ts, excluding tests and generated bindings) for
// any API that could spawn a process, and fails if one is found.
import * as fs from 'fs';
import * as path from 'path';

const NODES_DIR = path.join(__dirname);

const FORBIDDEN_PATTERNS: Array<{ name: string; re: RegExp }> = [
  { name: 'child_process import/require', re: /require\(\s*['"]child_process['"]\s*\)|from\s+['"]child_process['"]/ },
  { name: 'child_process.exec/execSync', re: /\bexecSync?\s*\(/ },
  { name: 'child_process.spawn/spawnSync', re: /\bspawnSync?\s*\(/ },
  { name: 'child_process.fork', re: /\bchild_process\.fork\s*\(/ },
  { name: 'process.binding', re: /process\.binding\s*\(/ },
  { name: 'node:child_process', re: /['"]node:child_process['"]/ },
  { name: 'eval', re: /\beval\s*\(/ },
  { name: 'new Function(', re: /new\s+Function\s*\(/ },
];

function listSourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) continue;
    if (!entry.name.endsWith('.ts')) continue;
    if (entry.name.endsWith('_test.ts')) continue; // test files themselves are allowed to name these strings in prose
    out.push(path.join(dir, entry.name));
  }
  return out;
}

describe('NO PROCESS EXECUTION (package-wide static audit)', () => {
  it('no node source file imports or calls any process-spawning API', () => {
    const files = listSourceFiles(NODES_DIR);
    // Sanity check the audit itself is actually scanning something.
    expect(files.length).toBeGreaterThanOrEqual(11);

    const violations: string[] = [];
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      for (const { name, re } of FORBIDDEN_PATTERNS) {
        if (re.test(content)) {
          violations.push(`${path.basename(file)}: matched forbidden pattern "${name}"`);
        }
      }
    }
    expect(violations).toEqual([]);
  });

  it('vm (used only for bounded, non-executing string work elsewhere in the seeding org\'s packages) is NOT used here either', () => {
    // shell-tools has no need for vm at all (unlike e.g. glob-tools' ReDoS
    // guard) — this package never runs a caller-supplied pattern against
    // anything. Asserting its absence keeps the "pure string transform,
    // zero execution surface" claim honest as the package evolves.
    const files = listSourceFiles(NODES_DIR);
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      expect(/require\(\s*['"]vm['"]\s*\)|from\s+['"]vm['"]/.test(content)).toBe(false);
    }
  });
});
