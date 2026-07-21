import { DetectShellMetacharactersRequest, DetectShellMetacharactersResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { detectMetacharacters, errorMessage } from './lib';

/**
 * Injection-risk check for a single candidate argument value: is it safe
 * to interpolate raw into a POSIX command line as one whitespace-delimited
 * word, or does it need quoting first?
 *
 * needs_quoting is defined consistently with EscapeArg: it is true if and
 * only if EscapeArg would change the value (i.e. the value does not
 * already round-trip as itself through the escaper). metacharacters_found
 * lists the distinct shell-special characters actually present in the
 * value (whitespace, quotes, $, backtick, ;, |, &, (, ), <, >, and other
 * POSIX-special punctuation) — empty when needs_quoting is false.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function detectShellMetacharacters(ax: AxiomContext, input: DetectShellMetacharactersRequest): DetectShellMetacharactersResult {
  const out = new DetectShellMetacharactersResult();
  try {
    const { needsQuoting, found } = detectMetacharacters(input.getValue() || '');
    out.setNeedsQuoting(needsQuoting);
    out.setMetacharactersFoundList(found);
    return out;
  } catch (e) {
    out.setError(errorMessage(e, 'DetectShellMetacharacters'));
    return out;
  }
}
