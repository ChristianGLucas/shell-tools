import { EscapeArgRequest, EscapeArgResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { escapeSingleArg, errorMessage } from './lib';

/**
 * Escape a SINGLE argument string for safe inclusion in a POSIX shell
 * command line — equivalent to QuoteArgv on a one-element list, exposed
 * separately because escaping one value at a time is the more common call
 * shape when assembling a command incrementally.
 *
 * A value that needs no escaping is returned unchanged, consistent with
 * DetectShellMetacharacters.needs_quoting (needs_quoting is defined as
 * "EscapeArg would change this value"). Proven safe against adversarial
 * input — `$(rm -rf /)`, backticks, `; rm`, embedded newlines, a leading
 * `-` — by the golden tests, which assert both a from-scratch POSIX
 * single-quote-escaping oracle and a round-trip through this package's own
 * tokenizer.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function escapeArg(ax: AxiomContext, input: EscapeArgRequest): EscapeArgResult {
  const out = new EscapeArgResult();
  try {
    out.setEscaped(escapeSingleArg(input.getValue() || ''));
    return out;
  } catch (e) {
    out.setError(errorMessage(e, 'EscapeArg'));
    return out;
  }
}
