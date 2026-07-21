import { ExtractRedirectionsRequest, ExtractRedirectionsResult, Redirection } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { tokenizeCommandLine, extractRedirectionsFromTokens, errorMessage } from './lib';

/**
 * Extract every I/O redirection from a command line as structured data, in
 * the order they appear: source file descriptor (when a bare digit
 * immediately precedes the operator, e.g. the "2" in "2>&1"; empty
 * otherwise), the operator itself (>, >>, <, <<, <<<, >&, <&), and the
 * target word that follows it.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractRedirections(ax: AxiomContext, input: ExtractRedirectionsRequest): ExtractRedirectionsResult {
  const out = new ExtractRedirectionsResult();
  try {
    const tokens = tokenizeCommandLine(input.getCommandLine() || '');
    const redirs = extractRedirectionsFromTokens(tokens);
    out.setRedirectionsList(
      redirs.map((r) => {
        const m = new Redirection();
        m.setFd(r.fd);
        m.setOperator(r.operator);
        m.setTarget(r.target);
        return m;
      }),
    );
    return out;
  } catch (e) {
    out.setError(errorMessage(e, 'ExtractRedirections'));
    return out;
  }
}
