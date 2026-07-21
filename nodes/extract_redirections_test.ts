import { ExtractRedirectionsRequest } from '../gen/messages_pb';
import { extractRedirections } from './extract_redirections';
import { ctx } from './testkit';

function req(commandLine: string): ExtractRedirectionsRequest {
  const r = new ExtractRedirectionsRequest();
  r.setCommandLine(commandLine);
  return r;
}

function redirSummary(result: ReturnType<typeof extractRedirections>) {
  return result.getRedirectionsList().map((r) => ({ fd: r.getFd(), operator: r.getOperator(), target: r.getTarget() }));
}

describe('ExtractRedirections', () => {
  it('GOLDEN: extracts >, >>, <, and an fd-duplication >& in order (hand-computed from shell-quote tokenization)', () => {
    const result = extractRedirections(ctx, req('cmd > out.txt 2>&1 < in.txt >> app.log'));
    expect(result.getError()).toBe('');
    expect(redirSummary(result)).toEqual([
      { fd: '', operator: '>', target: 'out.txt' },
      { fd: '2', operator: '>&', target: '1' },
      { fd: '', operator: '<', target: 'in.txt' },
      { fd: '', operator: '>>', target: 'app.log' },
    ]);
  });

  it('BUGFIX PROOF: a redirection target digit is not double-counted as the NEXT redirection\'s fd', () => {
    // "2>&1" targets "1"; the following "<" must NOT see that "1" as its
    // own fd just because it is a bare digit immediately before it.
    const result = extractRedirections(ctx, req('cmd 2>&1 < in.txt'));
    expect(redirSummary(result)).toEqual([
      { fd: '2', operator: '>&', target: '1' },
      { fd: '', operator: '<', target: 'in.txt' },
    ]);
  });

  it('no redirections present returns an empty list, no error', () => {
    const result = extractRedirections(ctx, req('echo hello world'));
    expect(result.getError()).toBe('');
    expect(result.getRedirectionsList()).toEqual([]);
  });

  it('SECURITY: $(...) as a redirection target is preserved verbatim, never evaluated', () => {
    const result = extractRedirections(ctx, req('cmd > $(danger)'));
    expect(redirSummary(result)).toEqual([{ fd: '', operator: '>', target: '$(danger)' }]);
  });

  it('a redirection with no following target has an empty target', () => {
    const result = extractRedirections(ctx, req('cmd >'));
    expect(redirSummary(result)).toEqual([{ fd: '', operator: '>', target: '' }]);
  });

  it('MALFORMED: propagates a structured error for unterminated quoting', () => {
    const result = extractRedirections(ctx, req("cmd > 'unterminated"));
    expect(result.getError()).toContain('unterminated quote');
  });
});
