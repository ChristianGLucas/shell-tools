import { ExtractEnvAssignmentsRequest, ExtractEnvAssignmentsResult, EnvAssignment } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { tokenizeCommandLine, splitEnvAssignments, errorMessage } from './lib';

/**
 * Extract the leading environment-variable assignments that prefix a
 * command (POSIX `FOO=bar BAZ=qux mycommand arg1` syntax): each
 * `NAME=value` pair, and the remaining plain-text argument words of the
 * command that follows them (operators dropped, same convention as
 * ExtractArgv). A command line with no leading assignments returns an
 * empty assignments list and the full argv in remaining_argv.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function extractEnvAssignments(ax: AxiomContext, input: ExtractEnvAssignmentsRequest): ExtractEnvAssignmentsResult {
  const out = new ExtractEnvAssignmentsResult();
  try {
    const tokens = tokenizeCommandLine(input.getCommandLine() || '');
    const { assignments, rest } = splitEnvAssignments(tokens);
    out.setAssignmentsList(
      assignments.map((a) => {
        const m = new EnvAssignment();
        m.setName(a.name);
        m.setValue(a.value);
        return m;
      }),
    );
    out.setRemainingArgvList(rest.filter((t) => !t.isOperator).map((t) => t.text));
    return out;
  } catch (e) {
    out.setError(errorMessage(e, 'ExtractEnvAssignments'));
    return out;
  }
}
