import { ParseCommandLineRequest } from '../gen/messages_pb';
import { parseCommandLine } from './parse_command_line';
import { ctx } from './testkit';

function req(commandLine: string): ParseCommandLineRequest {
  const r = new ParseCommandLineRequest();
  r.setCommandLine(commandLine);
  return r;
}

function toks(result: ReturnType<typeof parseCommandLine>) {
  return result.getTokensList().map((t) => ({ text: t.getText(), isOperator: t.getIsOperator() }));
}

describe('ParseCommandLine', () => {
  it('GOLDEN: tokenizes a mixed pipeline/sequence/redirect command line (hand-computed)', () => {
    const result = parseCommandLine(ctx, req('ls -la | grep foo && echo done ; cat file.txt > out.txt'));
    expect(result.getError()).toBe('');
    expect(toks(result)).toEqual([
      { text: 'ls', isOperator: false },
      { text: '-la', isOperator: false },
      { text: '|', isOperator: true },
      { text: 'grep', isOperator: false },
      { text: 'foo', isOperator: false },
      { text: '&&', isOperator: true },
      { text: 'echo', isOperator: false },
      { text: 'done', isOperator: false },
      { text: ';', isOperator: true },
      { text: 'cat', isOperator: false },
      { text: 'file.txt', isOperator: false },
      { text: '>', isOperator: true },
      { text: 'out.txt', isOperator: false },
    ]);
  });

  it('GOLDEN: recognizes every documented operator (hand-computed)', () => {
    const result = parseCommandLine(ctx, req('a | b || c && d ; e & f'));
    expect(result.getError()).toBe('');
    expect(toks(result)).toEqual([
      { text: 'a', isOperator: false },
      { text: '|', isOperator: true },
      { text: 'b', isOperator: false },
      { text: '||', isOperator: true },
      { text: 'c', isOperator: false },
      { text: '&&', isOperator: true },
      { text: 'd', isOperator: false },
      { text: ';', isOperator: true },
      { text: 'e', isOperator: false },
      { text: '&', isOperator: true },
      { text: 'f', isOperator: false },
    ]);
  });

  it('SECURITY: $(...) command substitution is preserved as ONE literal token, never split into operators', () => {
    const result = parseCommandLine(ctx, req('echo $(rm -rf /)'));
    expect(result.getError()).toBe('');
    // Without protection, shell-quote's own parser would return
    // ["echo","$",{op:"("},"rm","-rf","/",{op:")"}] — verified from source
    // and empirically before writing this package. This asserts the fix.
    expect(toks(result)).toEqual([
      { text: 'echo', isOperator: false },
      { text: '$(rm -rf /)', isOperator: false },
    ]);
  });

  it('SECURITY: nested $(...) is preserved as one literal token', () => {
    const result = parseCommandLine(ctx, req('echo $(echo $(whoami))'));
    expect(result.getError()).toBe('');
    expect(toks(result)).toEqual([
      { text: 'echo', isOperator: false },
      { text: '$(echo $(whoami))', isOperator: false },
    ]);
  });

  it('SECURITY: backtick command substitution containing spaces/pipes is preserved as ONE literal token', () => {
    const result = parseCommandLine(ctx, req('echo `rm -rf / | wc -l`'));
    expect(result.getError()).toBe('');
    // Without protection, shell-quote does not treat backtick as a quoting
    // context at all, so the space and "|" inside would be tokenized as
    // separate words/operators — verified empirically.
    expect(toks(result)).toEqual([
      { text: 'echo', isOperator: false },
      { text: '`rm -rf / | wc -l`', isOperator: false },
    ]);
  });

  it('SECURITY: $VAR and ${VAR} are preserved literally, never expanded (even to empty string)', () => {
    const result = parseCommandLine(ctx, req('echo $HOME/$USER ${PATH}'));
    expect(result.getError()).toBe('');
    // Without protection, shell-quote silently expands unresolved $VAR
    // references to the empty string even with no env argument at all —
    // verified empirically ("echo $HOME/$USER" with no env -> ["echo","/"]).
    expect(toks(result)).toEqual([
      { text: 'echo', isOperator: false },
      { text: '$HOME/$USER', isOperator: false },
      { text: '${PATH}', isOperator: false },
    ]);
  });

  it('SECURITY: a single-quoted string is fully literal, including $, ;, |, and backticks', () => {
    const result = parseCommandLine(ctx, req("echo '$(rm -rf /) ; & | > < `x`'"));
    expect(result.getError()).toBe('');
    expect(toks(result)).toEqual([
      { text: 'echo', isOperator: false },
      { text: '$(rm -rf /) ; & | > < `x`', isOperator: false },
    ]);
  });

  it('GOLDEN: double-quoted strings decode standard escapes and keep $/`` unexpanded', () => {
    const result = parseCommandLine(ctx, req('echo "a $(b) c" "d \\"e\\" f"'));
    expect(result.getError()).toBe('');
    expect(toks(result)).toEqual([
      { text: 'echo', isOperator: false },
      { text: 'a $(b) c', isOperator: false },
      { text: 'd "e" f', isOperator: false },
    ]);
  });

  it('MALFORMED: unterminated single quote returns a structured error, not a crash', () => {
    const result = parseCommandLine(ctx, req("echo 'unterminated"));
    expect(result.getError()).toContain('unterminated quote');
    expect(result.getTokensList()).toEqual([]);
  });

  it('MALFORMED: unterminated double quote returns a structured error', () => {
    const result = parseCommandLine(ctx, req('echo "unterminated'));
    expect(result.getError()).toContain('unterminated quote');
  });

  it('MALFORMED: unmatched closing parenthesis returns a structured error', () => {
    const result = parseCommandLine(ctx, req('echo hi )'));
    expect(result.getError()).toContain('unmatched closing parenthesis');
  });

  it('MALFORMED: unmatched opening parenthesis returns a structured error', () => {
    const result = parseCommandLine(ctx, req('(echo hi'));
    expect(result.getError()).toContain('unmatched opening parenthesis');
  });

  it('MALFORMED: unterminated $(...) returns a structured error', () => {
    const result = parseCommandLine(ctx, req('echo $(rm -rf /'));
    expect(result.getError()).toContain('unterminated $(...)');
  });

  it('MALFORMED: unterminated ${...} returns a structured error', () => {
    const result = parseCommandLine(ctx, req('echo ${FOO'));
    expect(result.getError()).toContain('unterminated ${...}');
  });

  it('MALFORMED: unterminated backtick returns a structured error', () => {
    const result = parseCommandLine(ctx, req('echo `whoami'));
    expect(result.getError()).toContain('unterminated `');
  });

  it('handles a large command_line without crashing (size limits are the platform\'s job)', () => {
    const result = parseCommandLine(ctx, req('a'.repeat(50000)));
    expect(result.getError()).toBe('');
  });

  it('handles a command line that tokenizes into many tokens without crashing', () => {
    // Alternating "<" ">" never merge into a multi-char operator (unlike
    // "<<" "<&" etc.), so this achieves a 1-char-per-token ratio.
    const commandLine = '<>'.repeat(5000);
    const result = parseCommandLine(ctx, req(commandLine));
    expect(result.getError()).toBe('');
    expect(result.getTokensList().length).toBeGreaterThan(9000);
  });

  it('DETERMINISM: identical input produces identical output across repeated invocations', () => {
    const r1 = parseCommandLine(ctx, req('ls -la | grep $(x)'));
    const r2 = parseCommandLine(ctx, req('ls -la | grep $(x)'));
    expect(toks(r1)).toEqual(toks(r2));
  });

  it('empty command line returns an empty token list, no error', () => {
    const result = parseCommandLine(ctx, req(''));
    expect(result.getError()).toBe('');
    expect(result.getTokensList()).toEqual([]);
  });
});
