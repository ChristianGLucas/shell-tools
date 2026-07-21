import { SplitPipelineRequest } from '../gen/messages_pb';
import { splitPipeline } from './split_pipeline';
import { ctx } from './testkit';

function req(commandLine: string): SplitPipelineRequest {
  const r = new SplitPipelineRequest();
  r.setCommandLine(commandLine);
  return r;
}

function stagesText(result: ReturnType<typeof splitPipeline>) {
  return result.getStagesList().map((s) => s.getTokensList().map((t) => ({ text: t.getText(), isOperator: t.getIsOperator() })));
}

describe('SplitPipeline', () => {
  it('GOLDEN: splits a three-stage pipeline on top-level | only', () => {
    const result = splitPipeline(ctx, req('cmd1 arg1 | cmd2 --flag | cmd3'));
    expect(result.getError()).toBe('');
    expect(stagesText(result)).toEqual([
      [{ text: 'cmd1', isOperator: false }, { text: 'arg1', isOperator: false }],
      [{ text: 'cmd2', isOperator: false }, { text: '--flag', isOperator: false }],
      [{ text: 'cmd3', isOperator: false }],
    ]);
  });

  it('a stage-local redirection is preserved inside that stage', () => {
    const result = splitPipeline(ctx, req('cmd1 2>&1 | cmd2 > out.txt'));
    expect(result.getError()).toBe('');
    expect(stagesText(result)).toEqual([
      [
        { text: 'cmd1', isOperator: false },
        { text: '2', isOperator: false },
        { text: '>&', isOperator: true },
        { text: '1', isOperator: false },
      ],
      [
        { text: 'cmd2', isOperator: false },
        { text: '>', isOperator: true },
        { text: 'out.txt', isOperator: false },
      ],
    ]);
  });

  it('SECURITY: $(...) inside a stage is preserved verbatim', () => {
    const result = splitPipeline(ctx, req('cmd1 | echo $(rm -rf /)'));
    expect(result.getError()).toBe('');
    expect(stagesText(result)[1]).toEqual([
      { text: 'echo', isOperator: false },
      { text: '$(rm -rf /)', isOperator: false },
    ]);
  });

  it('a single command with no | is one stage', () => {
    const result = splitPipeline(ctx, req('echo hi'));
    expect(result.getError()).toBe('');
    expect(result.getStagesList()).toHaveLength(1);
  });

  it('SCOPE: a top-level sequencer is a structured error, not a guess', () => {
    for (const cmd of ['cmd1 | cmd2 ; cmd3', 'cmd1 | cmd2 && cmd3', 'cmd1 | cmd2 || cmd3', 'cmd1 | cmd2 & cmd3']) {
      const result = splitPipeline(ctx, req(cmd));
      expect(result.getError()).toContain('does not support');
      expect(result.getStagesList()).toEqual([]);
    }
  });

  it('SCOPE: a subshell grouping paren is a structured error', () => {
    const result = splitPipeline(ctx, req('(cmd1 | cmd2)'));
    expect(result.getError()).toContain('does not support');
  });

  it('MALFORMED: an empty pipeline stage (double pipe / leading pipe / trailing pipe) is a structured error', () => {
    for (const cmd of ['cmd1 | | cmd2', '| cmd1', 'cmd1 |']) {
      const result = splitPipeline(ctx, req(cmd));
      expect(result.getError()).toContain('empty pipeline stage');
    }
  });

  it('MALFORMED: empty command line is a structured error', () => {
    const result = splitPipeline(ctx, req(''));
    expect(result.getError()).toContain('command_line is empty');
  });
});
