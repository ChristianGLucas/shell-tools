import { ExtractCommandNameRequest, ExtractCommandNameResult } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { tokenizeCommandLine, splitEnvAssignments, errorMessage } from './lib';

/**
 * Extract the leading command/executable name from a command line, after
 * skipping any leading `NAME=value` environment-variable assignments.
 *
 * Returns a structured error (command empty) when the line is empty,
 * malformed, or contains only env-var assignments with no command after
 * them.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractCommandName(ax: AxiomContext, input: ExtractCommandNameRequest): ExtractCommandNameResult {
  const out = new ExtractCommandNameResult();
  try {
    const tokens = tokenizeCommandLine(input.getCommandLine() || '');
    const { rest } = splitEnvAssignments(tokens);
    const first = rest[0];
    if (!first || first.isOperator) {
      out.setError('ExtractCommandName: command_line contains no command (empty, only env-var assignments, or starts with an operator)');
      return out;
    }
    out.setCommand(first.text);
    return out;
  } catch (e) {
    out.setError(errorMessage(e, 'ExtractCommandName'));
    return out;
  }
}
