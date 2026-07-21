import { SplitSequentialRequest, SplitSequentialResult, SequentialCommand, Token } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { tokenizeCommandLine, splitSequentialCommands, errorMessage } from './lib';

/**
 * Split a command line into sequential commands on top-level `;`, `&&`,
 * `||`, or `&`, preserving which operator joined each command to the one
 * before it (empty string for the first command). A `|` inside one command
 * is preserved as part of that command's own tokens — a single sequential
 * command may itself be a pipeline; only the four sequencer operators are
 * split points.
 *
 * Scope: a top-level subshell/grouping paren is reported as a structured
 * error (no nested-group support).
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function splitSequential(ax: AxiomContext, input: SplitSequentialRequest): SplitSequentialResult {
  const out = new SplitSequentialResult();
  try {
    const tokens = tokenizeCommandLine(input.getCommandLine() || '');
    const commands = splitSequentialCommands(tokens);
    out.setCommandsList(
      commands.map((cmd) => {
        const seq = new SequentialCommand();
        seq.setTokensList(
          cmd.tokens.map((t) => {
            const tok = new Token();
            tok.setText(t.text);
            tok.setIsOperator(t.isOperator);
            return tok;
          }),
        );
        seq.setJoiner(cmd.joiner);
        return seq;
      }),
    );
    return out;
  } catch (e) {
    out.setError(errorMessage(e, 'SplitSequential'));
    return out;
  }
}
