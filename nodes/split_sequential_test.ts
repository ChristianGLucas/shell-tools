import { SplitSequentialRequest } from '../gen/messages_pb';
import { splitSequential } from './split_sequential';
import { ctx } from './testkit';

function req(commandLine: string): SplitSequentialRequest {
  const r = new SplitSequentialRequest();
  r.setCommandLine(commandLine);
  return r;
}

function commandsSummary(result: ReturnType<typeof splitSequential>) {
  return result.getCommandsList().map((c) => ({
    joiner: c.getJoiner(),
    tokens: c.getTokensList().map((t) => ({ text: t.getText(), isOperator: t.getIsOperator() })),
  }));
}

describe('SplitSequential', () => {
  it('GOLDEN: splits on ;, &&, ||, & and preserves the joining operator', () => {
    const result = splitSequential(ctx, req('cmd1 ; cmd2 && cmd3 || cmd4 & cmd5'));
    expect(result.getError()).toBe('');
    expect(commandsSummary(result)).toEqual([
      { joiner: '', tokens: [{ text: 'cmd1', isOperator: false }] },
      { joiner: ';', tokens: [{ text: 'cmd2', isOperator: false }] },
      { joiner: '&&', tokens: [{ text: 'cmd3', isOperator: false }] },
      { joiner: '||', tokens: [{ text: 'cmd4', isOperator: false }] },
      { joiner: '&', tokens: [{ text: 'cmd5', isOperator: false }] },
    ]);
  });

  it('a | inside one command is preserved as part of that command, not a split point', () => {
    const result = splitSequential(ctx, req('cmd1 | cmd2 && cmd3'));
    expect(result.getError()).toBe('');
    expect(commandsSummary(result)).toEqual([
      {
        joiner: '',
        tokens: [
          { text: 'cmd1', isOperator: false },
          { text: '|', isOperator: true },
          { text: 'cmd2', isOperator: false },
        ],
      },
      { joiner: '&&', tokens: [{ text: 'cmd3', isOperator: false }] },
    ]);
  });

  it('a redirection inside one command is preserved as part of that command', () => {
    const result = splitSequential(ctx, req('cmd1 > out.txt ; cmd2'));
    expect(result.getError()).toBe('');
    expect(commandsSummary(result)[0].tokens).toEqual([
      { text: 'cmd1', isOperator: false },
      { text: '>', isOperator: true },
      { text: 'out.txt', isOperator: false },
    ]);
  });

  it('SECURITY: $(...) inside a command is preserved verbatim', () => {
    const result = splitSequential(ctx, req('cmd1 && echo $(rm -rf /)'));
    expect(result.getError()).toBe('');
    expect(commandsSummary(result)[1].tokens).toEqual([
      { text: 'echo', isOperator: false },
      { text: '$(rm -rf /)', isOperator: false },
    ]);
  });

  it('a single command with no sequencer is one command with an empty joiner', () => {
    const result = splitSequential(ctx, req('echo hi'));
    expect(result.getError()).toBe('');
    expect(result.getCommandsList()).toHaveLength(1);
    expect(result.getCommandsList()[0].getJoiner()).toBe('');
  });

  it('SCOPE: a subshell grouping paren is a structured error (no nested-group support)', () => {
    const result = splitSequential(ctx, req('(cmd1) ; cmd2'));
    expect(result.getError()).toContain('does not support');
    expect(result.getCommandsList()).toEqual([]);
  });

  it('MALFORMED: an empty command between/around sequencers is a structured error', () => {
    for (const cmd of ['cmd1 ; ; cmd2', '; cmd1', 'cmd1 ;']) {
      const result = splitSequential(ctx, req(cmd));
      expect(result.getError()).toContain('empty command in sequence');
    }
  });

  it('MALFORMED: empty command line is a structured error', () => {
    const result = splitSequential(ctx, req(''));
    expect(result.getError()).toContain('command_line is empty');
  });
});
