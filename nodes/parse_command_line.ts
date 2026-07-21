import { ParseCommandLineRequest, ParseCommandLineResult, Token } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { tokenizeCommandLine, errorMessage } from './lib';

/**
 * Parse a full POSIX-style command-line string into its ordered token
 * stream: plain-text argument words, and control operators (|, ||, &&, ;,
 * ;;, &, (, ), <, >, >>, <<, <<<, >&, <&, |&, <() as structured tokens
 * with is_operator=true.
 *
 * The most general node in the package — imposes no structure and never
 * rejects a supported operator. `$(...)`, `${...}`, `$VAR`, and backtick
 * substitution are preserved as literal, unevaluated text inside whatever
 * word they appear in: this node never executes, expands, or interprets
 * them, and never lets them fragment into spurious operator tokens (a gap
 * in the underlying shell-quote library's own parser that this package
 * closes — see nodes/lib.ts).
 *
 * Malformed input (unterminated quote, unmatched parenthesis, unterminated
 * substitution) returns a structured error instead of throwing or silently
 * mis-tokenizing. Input is length- and token-count-bounded.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function parseCommandLine(ax: AxiomContext, input: ParseCommandLineRequest): ParseCommandLineResult {
  const out = new ParseCommandLineResult();
  try {
    const raw = tokenizeCommandLine(input.getCommandLine() || '');
    out.setTokensList(
      raw.map((t) => {
        const tok = new Token();
        tok.setText(t.text);
        tok.setIsOperator(t.isOperator);
        return tok;
      }),
    );
    return out;
  } catch (e) {
    out.setError(errorMessage(e, 'ParseCommandLine'));
    return out;
  }
}
