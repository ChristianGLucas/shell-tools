import { QuoteArgvRequest, QuoteArgvResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { quoteArgv as quoteArgvList, errorMessage } from './lib';

/**
 * Quote/escape a list of argument strings into a single safe POSIX
 * command-line string, so that no argument's content — however
 * adversarial (embedded spaces, quotes, `$(...)`, backticks, `;`,
 * newlines) — can be reinterpreted as anything other than that argument's
 * literal value when the result is later parsed as a POSIX command line.
 *
 * Delegates to shell-quote's `quote()`: every argument that needs no
 * escaping is left bare; every other argument is either wrapped in single
 * quotes (when it contains no embedded single quote — nothing inside a
 * single-quoted POSIX string is ever special, not even `$(...)` or a
 * backslash) or wrapped in double quotes with `"`, `\`, `$`, and `` ` ``
 * individually backslash-escaped. Empty-array input produces an empty
 * string; an empty-string argument is quoted as `''`.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function quoteArgv(ax: AxiomContext, input: QuoteArgvRequest): QuoteArgvResult {
  const out = new QuoteArgvResult();
  try {
    out.setCommandLine(quoteArgvList(input.getArgvList() || []));
    return out;
  } catch (e) {
    out.setError(errorMessage(e, 'QuoteArgv'));
    return out;
  }
}
