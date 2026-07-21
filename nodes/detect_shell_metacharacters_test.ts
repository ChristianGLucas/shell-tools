import { DetectShellMetacharactersRequest } from '../gen/messages_pb';
import { detectShellMetacharacters } from './detect_shell_metacharacters';
import { escapeArg } from './escape_arg';
import { EscapeArgRequest } from '../gen/messages_pb';
import { ctx } from './testkit';
import { MAX_ARG_LEN } from './lib';

function req(value: string): DetectShellMetacharactersRequest {
  const r = new DetectShellMetacharactersRequest();
  r.setValue(value);
  return r;
}

function escape(value: string): string {
  const r = new EscapeArgRequest();
  r.setValue(value);
  return escapeArg(ctx, r).getEscaped();
}

describe('DetectShellMetacharacters', () => {
  it('GOLDEN: a plain safe value needs no quoting and reports no metacharacters', () => {
    const result = detectShellMetacharacters(ctx, req('plain123'));
    expect(result.getError()).toBe('');
    expect(result.getNeedsQuoting()).toBe(false);
    expect(result.getMetacharactersFoundList()).toEqual([]);
  });

  it('GOLDEN: a value with a space needs quoting and reports the space', () => {
    const result = detectShellMetacharacters(ctx, req('hello world'));
    expect(result.getNeedsQuoting()).toBe(true);
    expect(result.getMetacharactersFoundList()).toEqual([' ']);
  });

  it('GOLDEN: reports every distinct shell-special character present', () => {
    const result = detectShellMetacharacters(ctx, req('$(cmd);echo'));
    expect(result.getNeedsQuoting()).toBe(true);
    const found = result.getMetacharactersFoundList().sort();
    expect(found).toEqual(['$', '(', ')', ';'].sort());
  });

  it('an argument-like leading dash is NOT flagged as a shell metacharacter', () => {
    const result = detectShellMetacharacters(ctx, req('-rf'));
    expect(result.getNeedsQuoting()).toBe(false);
    expect(result.getMetacharactersFoundList()).toEqual([]);
  });

  it('CONSISTENCY (enforced invariant): needs_quoting === (EscapeArg would change the value)', () => {
    const values = [
      'hello',
      '-flag',
      '$(x)',
      'a b',
      "it's",
      '',
      'plain123',
      'a;b',
      '`x`',
      'a/b/c',
      '--opt=val',
      '2>&1',
      '~/.bashrc',
      '{a,b}',
      '[abc]',
    ];
    for (const v of values) {
      const detected = detectShellMetacharacters(ctx, req(v)).getNeedsQuoting();
      const changedByEscape = escape(v) !== v;
      expect(detected).toBe(changedByEscape);
    }
  });

  it('empty string needs quoting (an unquoted empty word is not a valid POSIX argument)', () => {
    const result = detectShellMetacharacters(ctx, req(''));
    expect(result.getNeedsQuoting()).toBe(true);
  });

  it('BOUNDS: rejects a value longer than MAX_ARG_LEN', () => {
    const result = detectShellMetacharacters(ctx, req('a'.repeat(MAX_ARG_LEN + 1)));
    expect(result.getError()).toContain('exceeds the maximum');
  });

  it('DETERMINISM: identical input produces identical output across repeated invocations', () => {
    const r1 = detectShellMetacharacters(ctx, req('$(x) a;b'));
    const r2 = detectShellMetacharacters(ctx, req('$(x) a;b'));
    expect(r1.getNeedsQuoting()).toBe(r2.getNeedsQuoting());
    expect(r1.getMetacharactersFoundList()).toEqual(r2.getMetacharactersFoundList());
  });
});
