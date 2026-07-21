import { ExtractArgvRequest } from '../gen/messages_pb';
import { extractArgv } from './extract_argv';
import { ctx } from './testkit';

function req(commandLine: string): ExtractArgvRequest {
  const r = new ExtractArgvRequest();
  r.setCommandLine(commandLine);
  return r;
}

describe('ExtractArgv', () => {
  it('GOLDEN: drops pipe/sequencer/redirect operators, keeps every word', () => {
    const result = extractArgv(ctx, req('ls -la | grep foo && echo done ; cat file.txt > out.txt'));
    expect(result.getError()).toBe('');
    expect(result.getArgvList()).toEqual(['ls', '-la', 'grep', 'foo', 'echo', 'done', 'cat', 'file.txt', 'out.txt']);
  });

  it('redirection targets and env-assignment right-hand sides are NOT filtered (documented behaviour)', () => {
    const result = extractArgv(ctx, req('FOO=bar cmd > out.txt'));
    expect(result.getArgvList()).toEqual(['FOO=bar', 'cmd', 'out.txt']);
  });

  it('SECURITY: $(...) inside a word is preserved verbatim, never evaluated', () => {
    const result = extractArgv(ctx, req('echo $(rm -rf /) `whoami`'));
    expect(result.getArgvList()).toEqual(['echo', '$(rm -rf /)', '`whoami`']);
  });

  it('empty command line returns an empty argv, no error', () => {
    const result = extractArgv(ctx, req(''));
    expect(result.getError()).toBe('');
    expect(result.getArgvList()).toEqual([]);
  });

  it('MALFORMED: propagates a structured error for unterminated quoting', () => {
    const result = extractArgv(ctx, req("echo 'unterminated"));
    expect(result.getError()).toContain('unterminated quote');
    expect(result.getArgvList()).toEqual([]);
  });
});
