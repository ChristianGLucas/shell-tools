import { SplitPipelineRequest, SplitPipelineResult, PipelineStage, Token } from '../gen/messages_pb';
import { AxiomContext } from '../gen/axiomContext';
import { tokenizeCommandLine, splitPipelineStages, errorMessage } from './lib';

/**
 * Split a command line into its pipeline stages: the segments between
 * top-level `|` operators (not `||`). Each stage keeps its own full token
 * stream, so a stage-local redirection (e.g. `cmd 2>&1`) is preserved
 * rather than discarded.
 *
 * Scope: a single flat pipeline only — if the input contains a top-level
 * sequencer (`;`, `&&`, `||`, `&`) or a subshell/grouping paren, that is
 * reported as a structured error rather than guessed at. Split with
 * SplitSequential first, then apply SplitPipeline to each resulting
 * command.
 *
 * @param ax - Platform context: ax.log for logging, ax.secrets for secrets.
 */
export function splitPipeline(ax: AxiomContext, input: SplitPipelineRequest): SplitPipelineResult {
  const out = new SplitPipelineResult();
  try {
    const tokens = tokenizeCommandLine(input.getCommandLine() || '');
    const stages = splitPipelineStages(tokens);
    out.setStagesList(
      stages.map((stageTokens) => {
        const stage = new PipelineStage();
        stage.setTokensList(
          stageTokens.map((t) => {
            const tok = new Token();
            tok.setText(t.text);
            tok.setIsOperator(t.isOperator);
            return tok;
          }),
        );
        return stage;
      }),
    );
    return out;
  } catch (e) {
    out.setError(errorMessage(e, 'SplitPipeline'));
    return out;
  }
}
