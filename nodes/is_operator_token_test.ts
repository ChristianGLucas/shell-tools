import { IsOperatorTokenRequest } from '../gen/messages_pb';
import { isOperatorToken } from './is_operator_token';
import { ctx } from './testkit';
import { OPERATORS, MAX_ARG_LEN } from './lib';

function req(token: string): IsOperatorTokenRequest {
  const r = new IsOperatorTokenRequest();
  r.setToken(token);
  return r;
}

describe('IsOperatorToken', () => {
  it('GOLDEN: every entry in the documented operator vocabulary is recognized', () => {
    for (const op of OPERATORS) {
      const result = isOperatorToken(ctx, req(op));
      expect(result.getError()).toBe('');
      expect(result.getIsOperator()).toBe(true);
    }
  });

  it('GOLDEN: ordinary literal words are not operators', () => {
    for (const word of ['ls', '--flag', 'file.txt', '$(x)', '`x`', '-rf', '', 'a|b', 'a;b']) {
      const result = isOperatorToken(ctx, req(word));
      expect(result.getIsOperator()).toBe(false);
    }
  });

  it('exact match only: a token merely CONTAINING an operator is not itself an operator', () => {
    // "a|b" contains "|" but is not the token "|" itself — this node
    // classifies the exact given token, it does not scan for embedded
    // metacharacters (that is DetectShellMetacharacters' job).
    expect(isOperatorToken(ctx, req('a|b')).getIsOperator()).toBe(false);
    expect(isOperatorToken(ctx, req('||x')).getIsOperator()).toBe(false);
  });

  it('BOUNDS: rejects a token longer than MAX_ARG_LEN', () => {
    const result = isOperatorToken(ctx, req('a'.repeat(MAX_ARG_LEN + 1)));
    expect(result.getError()).toContain('exceeds the maximum');
  });

  it('DETERMINISM: identical input produces identical output across repeated invocations', () => {
    expect(isOperatorToken(ctx, req('&&')).getIsOperator()).toBe(isOperatorToken(ctx, req('&&')).getIsOperator());
  });
});
