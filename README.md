# shell-tools

Deterministic **parsing** and safe **construction** of POSIX shell
command-line strings, built for the [Axiom](https://axiomide.com) marketplace
under the `christiangeorgelucas` handle.

**This package never executes, spawns, or touches a shell.** Every node is a
pure, deterministic text-in / structured-or-text-out transform: tokenize a
command-line string, split it into pipeline stages or sequential commands,
extract redirections/env-assignments/the command name, or quote/escape
arguments into a safe command string. It is the "build or take apart a
shell command string" toolkit an agent reaches for constantly, without ever
running anything.

Wraps [`shell-quote`](https://github.com/ljharb/shell-quote) (MIT, zero
runtime dependencies) — `parse()` for POSIX tokenizing, `quote()` for
POSIX-safe escaping.

## The one hard rule this package is built around

`$(...)`, `` `...` ``, and `${...}`/`$VAR` are **never interpreted or
expanded** — every parsing node treats them as opaque literal text. This
matters because `shell-quote`'s own `parse()` does **not** do this by
default: unprotected, it silently decomposes `$(...)` into stray operator
tokens (`echo $(rm -rf /)` → `["echo","$",{op:"("},"rm","-rf","/",{op:")"}]`)
and can shred a backtick command-substitution span across word/operator
boundaries the moment it contains whitespace or a pipe. This package
pre-protects every such construct (see `nodes/lib.ts`) before handing the
string to `shell-quote`, so the original text always survives byte-for-byte,
unevaluated, wherever it appeared.

## Nodes

- **ParseCommandLine** — tokenize a full command line into its ordered
  token stream (words + structured operators: `|`, `||`, `&&`, `;`, `;;`,
  `&`, `(`, `)`, `<`, `>`, `>>`, `<<`, `<<<`, `>&`, `<&`, `|&`, `<(`).
- **ExtractArgv** — just the plain-text argument words, operators dropped.
- **QuoteArgv** — quote/escape an argv list into one safe command string.
- **EscapeArg** — quote/escape a single argument.
- **SplitPipeline** — split into pipeline stages on top-level `|`.
- **SplitSequential** — split into sequential commands on `;`/`&&`/`||`/`&`,
  preserving the joining operator.
- **ExtractRedirections** — extract `>`, `>>`, `<`, `<<`, `2>&1`-style
  redirections as structured `{fd, operator, target}` data.
- **DetectShellMetacharacters** — "does this value need quoting?" /
  injection-risk check, defined consistently with EscapeArg.
- **ExtractEnvAssignments** — extract leading `NAME=value` assignments and
  the remaining command.
- **ExtractCommandName** — extract the leading command name (after any env
  assignments).
- **IsOperatorToken** — is this exact token text a recognized shell
  operator?

## Security-critical surface

`EscapeArg`/`QuoteArgv` and `DetectShellMetacharacters` are tested against
an adversarial battery (`$(rm -rf /)`, backticks, `; rm`, embedded
newlines/null bytes, leading dashes) via an **independent oracle**: a
from-scratch POSIX word-splitter (`nodes/posix_oracle.ts`, not `shell-quote`)
that round-trips the escaped output back to the exact original argument.
`nodes/no_process_execution_test.ts` statically audits every source file
this package ships for any process-spawning API and fails the suite if one
is ever introduced.

All input is length-bounded; malformed input (unterminated quotes/parens/
substitutions) returns a structured error rather than crashing or silently
mis-parsing.

## License

MIT — see [LICENSE](./LICENSE).
