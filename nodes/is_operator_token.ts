import { IsOperatorTokenRequest, IsOperatorTokenResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { isKnownOperator, checkArgValue, errorMessage } from './lib';

/**
 * Classify a single token's literal text: is it recognized as a POSIX
 * shell control operator (exact match against | || && ; ;; & > >> < << <<<
 * >& <& |& ( ) <(), or is it an ordinary literal word?
 *
 * Answers whether an exact token — such as one produced by
 * ParseCommandLine, SplitPipeline, or SplitSequential — is itself an
 * operator; it does not scan an arbitrary string for embedded
 * metacharacters (see DetectShellMetacharacters for that).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function isOperatorToken(ax: AxiomContext, input: IsOperatorTokenRequest): IsOperatorTokenResult {
  const out = new IsOperatorTokenResult();
  try {
    const token = input.getToken() || '';
    checkArgValue(token, 'token');
    out.setIsOperator(isKnownOperator(token));
    return out;
  } catch (e) {
    out.setError(errorMessage(e, 'IsOperatorToken'));
    return out;
  }
}
