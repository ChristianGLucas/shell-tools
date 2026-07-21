import { ExtractArgvRequest, ExtractArgvResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { tokenizeCommandLine, errorMessage } from './lib';

/**
 * Extract just the plain-text argument words from a command line, dropping
 * every control operator (pipes, sequencers, redirections, parens).
 *
 * Redirection targets and env-assignment right-hand sides are ordinary
 * words to this node and are NOT filtered out — use ExtractRedirections /
 * ExtractEnvAssignments for a semantics-aware view. `$(...)`/`${...}`/
 * backtick constructs inside a word are preserved verbatim, never
 * evaluated. Malformed input returns a structured error.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractArgv(ax: AxiomContext, input: ExtractArgvRequest): ExtractArgvResult {
  const out = new ExtractArgvResult();
  try {
    const tokens = tokenizeCommandLine(input.getCommandLine() || '');
    out.setArgvList(tokens.filter((t) => !t.isOperator).map((t) => t.text));
    return out;
  } catch (e) {
    out.setError(errorMessage(e, 'ExtractArgv'));
    return out;
  }
}
