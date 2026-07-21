import { ExtractEnvAssignmentsRequest } from '../gen/messages_pb';
import { extractEnvAssignments } from './extract_env_assignments';
import { ctx } from './testkit';

function req(commandLine: string): ExtractEnvAssignmentsRequest {
  const r = new ExtractEnvAssignmentsRequest();
  r.setCommandLine(commandLine);
  return r;
}

function assignSummary(result: ReturnType<typeof extractEnvAssignments>) {
  return result.getAssignmentsList().map((a) => ({ name: a.getName(), value: a.getValue() }));
}

describe('ExtractEnvAssignments', () => {
  it('GOLDEN: extracts multiple leading assignments and the remaining command', () => {
    const result = extractEnvAssignments(ctx, req('FOO=bar BAZ=qux mycommand arg1'));
    expect(result.getError()).toBe('');
    expect(assignSummary(result)).toEqual([
      { name: 'FOO', value: 'bar' },
      { name: 'BAZ', value: 'qux' },
    ]);
    expect(result.getRemainingArgvList()).toEqual(['mycommand', 'arg1']);
  });

  it('no leading assignments returns an empty assignments list and the full argv', () => {
    const result = extractEnvAssignments(ctx, req('ls -la'));
    expect(result.getError()).toBe('');
    expect(assignSummary(result)).toEqual([]);
    expect(result.getRemainingArgvList()).toEqual(['ls', '-la']);
  });

  it('a value containing "=" keeps everything after the first "=" verbatim', () => {
    const result = extractEnvAssignments(ctx, req('FOO=a=b=c cmd'));
    expect(assignSummary(result)).toEqual([{ name: 'FOO', value: 'a=b=c' }]);
    expect(result.getRemainingArgvList()).toEqual(['cmd']);
  });

  it('only assignments, no command, returns an empty remaining_argv', () => {
    const result = extractEnvAssignments(ctx, req('FOO=bar'));
    expect(assignSummary(result)).toEqual([{ name: 'FOO', value: 'bar' }]);
    expect(result.getRemainingArgvList()).toEqual([]);
  });

  it('SECURITY: $(...) inside an assignment value is preserved verbatim, never evaluated', () => {
    const result = extractEnvAssignments(ctx, req('FOO=$(rm -rf /) cmd'));
    expect(assignSummary(result)).toEqual([{ name: 'FOO', value: '$(rm -rf /)' }]);
  });

  it('a word that merely contains "=" but is not a valid NAME=value assignment (e.g. starts with a digit) is treated as a command word, not an assignment', () => {
    const result = extractEnvAssignments(ctx, req('1FOO=bar cmd'));
    expect(assignSummary(result)).toEqual([]);
    expect(result.getRemainingArgvList()).toEqual(['1FOO=bar', 'cmd']);
  });

  it('empty command line returns empty assignments and empty remaining_argv, no error', () => {
    const result = extractEnvAssignments(ctx, req(''));
    expect(result.getError()).toBe('');
    expect(assignSummary(result)).toEqual([]);
    expect(result.getRemainingArgvList()).toEqual([]);
  });
});
