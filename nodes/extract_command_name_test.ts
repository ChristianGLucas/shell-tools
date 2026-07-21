import { ExtractCommandNameRequest } from '../gen/messages_pb';
import { extractCommandName } from './extract_command_name';
import { ctx } from './testkit';

function req(commandLine: string): ExtractCommandNameRequest {
  const r = new ExtractCommandNameRequest();
  r.setCommandLine(commandLine);
  return r;
}

describe('ExtractCommandName', () => {
  it('GOLDEN: extracts the leading command with no env prefix', () => {
    const result = extractCommandName(ctx, req('ls -la'));
    expect(result.getError()).toBe('');
    expect(result.getCommand()).toBe('ls');
  });

  it('GOLDEN: skips leading env-var assignments to find the command', () => {
    const result = extractCommandName(ctx, req('FOO=bar BAZ=qux mycommand arg1'));
    expect(result.getError()).toBe('');
    expect(result.getCommand()).toBe('mycommand');
  });

  it('SECURITY: a $(...) command name is preserved verbatim (still just a literal word)', () => {
    const result = extractCommandName(ctx, req('$(danger) arg1'));
    expect(result.getCommand()).toBe('$(danger)');
  });

  it('MALFORMED: empty command line returns a structured error', () => {
    const result = extractCommandName(ctx, req(''));
    expect(result.getError()).toContain('no command');
    expect(result.getCommand()).toBe('');
  });

  it('MALFORMED: only env-var assignments with no command returns a structured error', () => {
    const result = extractCommandName(ctx, req('FOO=bar BAZ=qux'));
    expect(result.getError()).toContain('no command');
  });

  it('MALFORMED: a command line starting with an operator returns a structured error', () => {
    const result = extractCommandName(ctx, req('| ls'));
    expect(result.getError()).toContain('no command');
  });
});
