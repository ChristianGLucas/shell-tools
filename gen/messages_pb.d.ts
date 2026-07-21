// package: christiangeorgelucas.shell_tools
// file: messages.proto

import * as jspb from "google-protobuf";

export class Token extends jspb.Message {
  getText(): string;
  setText(value: string): void;

  getIsOperator(): boolean;
  setIsOperator(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Token.AsObject;
  static toObject(includeInstance: boolean, msg: Token): Token.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Token, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Token;
  static deserializeBinaryFromReader(message: Token, reader: jspb.BinaryReader): Token;
}

export namespace Token {
  export type AsObject = {
    text: string,
    isOperator: boolean,
  }
}

export class ParseCommandLineRequest extends jspb.Message {
  getCommandLine(): string;
  setCommandLine(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParseCommandLineRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ParseCommandLineRequest): ParseCommandLineRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParseCommandLineRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParseCommandLineRequest;
  static deserializeBinaryFromReader(message: ParseCommandLineRequest, reader: jspb.BinaryReader): ParseCommandLineRequest;
}

export namespace ParseCommandLineRequest {
  export type AsObject = {
    commandLine: string,
  }
}

export class ParseCommandLineResult extends jspb.Message {
  clearTokensList(): void;
  getTokensList(): Array<Token>;
  setTokensList(value: Array<Token>): void;
  addTokens(value?: Token, index?: number): Token;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ParseCommandLineResult.AsObject;
  static toObject(includeInstance: boolean, msg: ParseCommandLineResult): ParseCommandLineResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ParseCommandLineResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ParseCommandLineResult;
  static deserializeBinaryFromReader(message: ParseCommandLineResult, reader: jspb.BinaryReader): ParseCommandLineResult;
}

export namespace ParseCommandLineResult {
  export type AsObject = {
    tokensList: Array<Token.AsObject>,
    error: string,
  }
}

export class ExtractArgvRequest extends jspb.Message {
  getCommandLine(): string;
  setCommandLine(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractArgvRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractArgvRequest): ExtractArgvRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractArgvRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractArgvRequest;
  static deserializeBinaryFromReader(message: ExtractArgvRequest, reader: jspb.BinaryReader): ExtractArgvRequest;
}

export namespace ExtractArgvRequest {
  export type AsObject = {
    commandLine: string,
  }
}

export class ExtractArgvResult extends jspb.Message {
  clearArgvList(): void;
  getArgvList(): Array<string>;
  setArgvList(value: Array<string>): void;
  addArgv(value: string, index?: number): string;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractArgvResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractArgvResult): ExtractArgvResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractArgvResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractArgvResult;
  static deserializeBinaryFromReader(message: ExtractArgvResult, reader: jspb.BinaryReader): ExtractArgvResult;
}

export namespace ExtractArgvResult {
  export type AsObject = {
    argvList: Array<string>,
    error: string,
  }
}

export class QuoteArgvRequest extends jspb.Message {
  clearArgvList(): void;
  getArgvList(): Array<string>;
  setArgvList(value: Array<string>): void;
  addArgv(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QuoteArgvRequest.AsObject;
  static toObject(includeInstance: boolean, msg: QuoteArgvRequest): QuoteArgvRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: QuoteArgvRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QuoteArgvRequest;
  static deserializeBinaryFromReader(message: QuoteArgvRequest, reader: jspb.BinaryReader): QuoteArgvRequest;
}

export namespace QuoteArgvRequest {
  export type AsObject = {
    argvList: Array<string>,
  }
}

export class QuoteArgvResult extends jspb.Message {
  getCommandLine(): string;
  setCommandLine(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): QuoteArgvResult.AsObject;
  static toObject(includeInstance: boolean, msg: QuoteArgvResult): QuoteArgvResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: QuoteArgvResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): QuoteArgvResult;
  static deserializeBinaryFromReader(message: QuoteArgvResult, reader: jspb.BinaryReader): QuoteArgvResult;
}

export namespace QuoteArgvResult {
  export type AsObject = {
    commandLine: string,
    error: string,
  }
}

export class EscapeArgRequest extends jspb.Message {
  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EscapeArgRequest.AsObject;
  static toObject(includeInstance: boolean, msg: EscapeArgRequest): EscapeArgRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EscapeArgRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EscapeArgRequest;
  static deserializeBinaryFromReader(message: EscapeArgRequest, reader: jspb.BinaryReader): EscapeArgRequest;
}

export namespace EscapeArgRequest {
  export type AsObject = {
    value: string,
  }
}

export class EscapeArgResult extends jspb.Message {
  getEscaped(): string;
  setEscaped(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EscapeArgResult.AsObject;
  static toObject(includeInstance: boolean, msg: EscapeArgResult): EscapeArgResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EscapeArgResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EscapeArgResult;
  static deserializeBinaryFromReader(message: EscapeArgResult, reader: jspb.BinaryReader): EscapeArgResult;
}

export namespace EscapeArgResult {
  export type AsObject = {
    escaped: string,
    error: string,
  }
}

export class SplitPipelineRequest extends jspb.Message {
  getCommandLine(): string;
  setCommandLine(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SplitPipelineRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SplitPipelineRequest): SplitPipelineRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SplitPipelineRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SplitPipelineRequest;
  static deserializeBinaryFromReader(message: SplitPipelineRequest, reader: jspb.BinaryReader): SplitPipelineRequest;
}

export namespace SplitPipelineRequest {
  export type AsObject = {
    commandLine: string,
  }
}

export class PipelineStage extends jspb.Message {
  clearTokensList(): void;
  getTokensList(): Array<Token>;
  setTokensList(value: Array<Token>): void;
  addTokens(value?: Token, index?: number): Token;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PipelineStage.AsObject;
  static toObject(includeInstance: boolean, msg: PipelineStage): PipelineStage.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PipelineStage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PipelineStage;
  static deserializeBinaryFromReader(message: PipelineStage, reader: jspb.BinaryReader): PipelineStage;
}

export namespace PipelineStage {
  export type AsObject = {
    tokensList: Array<Token.AsObject>,
  }
}

export class SplitPipelineResult extends jspb.Message {
  clearStagesList(): void;
  getStagesList(): Array<PipelineStage>;
  setStagesList(value: Array<PipelineStage>): void;
  addStages(value?: PipelineStage, index?: number): PipelineStage;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SplitPipelineResult.AsObject;
  static toObject(includeInstance: boolean, msg: SplitPipelineResult): SplitPipelineResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SplitPipelineResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SplitPipelineResult;
  static deserializeBinaryFromReader(message: SplitPipelineResult, reader: jspb.BinaryReader): SplitPipelineResult;
}

export namespace SplitPipelineResult {
  export type AsObject = {
    stagesList: Array<PipelineStage.AsObject>,
    error: string,
  }
}

export class SequentialCommand extends jspb.Message {
  clearTokensList(): void;
  getTokensList(): Array<Token>;
  setTokensList(value: Array<Token>): void;
  addTokens(value?: Token, index?: number): Token;

  getJoiner(): string;
  setJoiner(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SequentialCommand.AsObject;
  static toObject(includeInstance: boolean, msg: SequentialCommand): SequentialCommand.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SequentialCommand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SequentialCommand;
  static deserializeBinaryFromReader(message: SequentialCommand, reader: jspb.BinaryReader): SequentialCommand;
}

export namespace SequentialCommand {
  export type AsObject = {
    tokensList: Array<Token.AsObject>,
    joiner: string,
  }
}

export class SplitSequentialRequest extends jspb.Message {
  getCommandLine(): string;
  setCommandLine(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SplitSequentialRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SplitSequentialRequest): SplitSequentialRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SplitSequentialRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SplitSequentialRequest;
  static deserializeBinaryFromReader(message: SplitSequentialRequest, reader: jspb.BinaryReader): SplitSequentialRequest;
}

export namespace SplitSequentialRequest {
  export type AsObject = {
    commandLine: string,
  }
}

export class SplitSequentialResult extends jspb.Message {
  clearCommandsList(): void;
  getCommandsList(): Array<SequentialCommand>;
  setCommandsList(value: Array<SequentialCommand>): void;
  addCommands(value?: SequentialCommand, index?: number): SequentialCommand;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SplitSequentialResult.AsObject;
  static toObject(includeInstance: boolean, msg: SplitSequentialResult): SplitSequentialResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SplitSequentialResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SplitSequentialResult;
  static deserializeBinaryFromReader(message: SplitSequentialResult, reader: jspb.BinaryReader): SplitSequentialResult;
}

export namespace SplitSequentialResult {
  export type AsObject = {
    commandsList: Array<SequentialCommand.AsObject>,
    error: string,
  }
}

export class Redirection extends jspb.Message {
  getFd(): string;
  setFd(value: string): void;

  getOperator(): string;
  setOperator(value: string): void;

  getTarget(): string;
  setTarget(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Redirection.AsObject;
  static toObject(includeInstance: boolean, msg: Redirection): Redirection.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Redirection, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Redirection;
  static deserializeBinaryFromReader(message: Redirection, reader: jspb.BinaryReader): Redirection;
}

export namespace Redirection {
  export type AsObject = {
    fd: string,
    operator: string,
    target: string,
  }
}

export class ExtractRedirectionsRequest extends jspb.Message {
  getCommandLine(): string;
  setCommandLine(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractRedirectionsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractRedirectionsRequest): ExtractRedirectionsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractRedirectionsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractRedirectionsRequest;
  static deserializeBinaryFromReader(message: ExtractRedirectionsRequest, reader: jspb.BinaryReader): ExtractRedirectionsRequest;
}

export namespace ExtractRedirectionsRequest {
  export type AsObject = {
    commandLine: string,
  }
}

export class ExtractRedirectionsResult extends jspb.Message {
  clearRedirectionsList(): void;
  getRedirectionsList(): Array<Redirection>;
  setRedirectionsList(value: Array<Redirection>): void;
  addRedirections(value?: Redirection, index?: number): Redirection;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractRedirectionsResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractRedirectionsResult): ExtractRedirectionsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractRedirectionsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractRedirectionsResult;
  static deserializeBinaryFromReader(message: ExtractRedirectionsResult, reader: jspb.BinaryReader): ExtractRedirectionsResult;
}

export namespace ExtractRedirectionsResult {
  export type AsObject = {
    redirectionsList: Array<Redirection.AsObject>,
    error: string,
  }
}

export class DetectShellMetacharactersRequest extends jspb.Message {
  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DetectShellMetacharactersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DetectShellMetacharactersRequest): DetectShellMetacharactersRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DetectShellMetacharactersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DetectShellMetacharactersRequest;
  static deserializeBinaryFromReader(message: DetectShellMetacharactersRequest, reader: jspb.BinaryReader): DetectShellMetacharactersRequest;
}

export namespace DetectShellMetacharactersRequest {
  export type AsObject = {
    value: string,
  }
}

export class DetectShellMetacharactersResult extends jspb.Message {
  getNeedsQuoting(): boolean;
  setNeedsQuoting(value: boolean): void;

  clearMetacharactersFoundList(): void;
  getMetacharactersFoundList(): Array<string>;
  setMetacharactersFoundList(value: Array<string>): void;
  addMetacharactersFound(value: string, index?: number): string;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DetectShellMetacharactersResult.AsObject;
  static toObject(includeInstance: boolean, msg: DetectShellMetacharactersResult): DetectShellMetacharactersResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DetectShellMetacharactersResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DetectShellMetacharactersResult;
  static deserializeBinaryFromReader(message: DetectShellMetacharactersResult, reader: jspb.BinaryReader): DetectShellMetacharactersResult;
}

export namespace DetectShellMetacharactersResult {
  export type AsObject = {
    needsQuoting: boolean,
    metacharactersFoundList: Array<string>,
    error: string,
  }
}

export class EnvAssignment extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getValue(): string;
  setValue(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): EnvAssignment.AsObject;
  static toObject(includeInstance: boolean, msg: EnvAssignment): EnvAssignment.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: EnvAssignment, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): EnvAssignment;
  static deserializeBinaryFromReader(message: EnvAssignment, reader: jspb.BinaryReader): EnvAssignment;
}

export namespace EnvAssignment {
  export type AsObject = {
    name: string,
    value: string,
  }
}

export class ExtractEnvAssignmentsRequest extends jspb.Message {
  getCommandLine(): string;
  setCommandLine(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractEnvAssignmentsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractEnvAssignmentsRequest): ExtractEnvAssignmentsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractEnvAssignmentsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractEnvAssignmentsRequest;
  static deserializeBinaryFromReader(message: ExtractEnvAssignmentsRequest, reader: jspb.BinaryReader): ExtractEnvAssignmentsRequest;
}

export namespace ExtractEnvAssignmentsRequest {
  export type AsObject = {
    commandLine: string,
  }
}

export class ExtractEnvAssignmentsResult extends jspb.Message {
  clearAssignmentsList(): void;
  getAssignmentsList(): Array<EnvAssignment>;
  setAssignmentsList(value: Array<EnvAssignment>): void;
  addAssignments(value?: EnvAssignment, index?: number): EnvAssignment;

  clearRemainingArgvList(): void;
  getRemainingArgvList(): Array<string>;
  setRemainingArgvList(value: Array<string>): void;
  addRemainingArgv(value: string, index?: number): string;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractEnvAssignmentsResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractEnvAssignmentsResult): ExtractEnvAssignmentsResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractEnvAssignmentsResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractEnvAssignmentsResult;
  static deserializeBinaryFromReader(message: ExtractEnvAssignmentsResult, reader: jspb.BinaryReader): ExtractEnvAssignmentsResult;
}

export namespace ExtractEnvAssignmentsResult {
  export type AsObject = {
    assignmentsList: Array<EnvAssignment.AsObject>,
    remainingArgvList: Array<string>,
    error: string,
  }
}

export class ExtractCommandNameRequest extends jspb.Message {
  getCommandLine(): string;
  setCommandLine(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractCommandNameRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractCommandNameRequest): ExtractCommandNameRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractCommandNameRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractCommandNameRequest;
  static deserializeBinaryFromReader(message: ExtractCommandNameRequest, reader: jspb.BinaryReader): ExtractCommandNameRequest;
}

export namespace ExtractCommandNameRequest {
  export type AsObject = {
    commandLine: string,
  }
}

export class ExtractCommandNameResult extends jspb.Message {
  getCommand(): string;
  setCommand(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExtractCommandNameResult.AsObject;
  static toObject(includeInstance: boolean, msg: ExtractCommandNameResult): ExtractCommandNameResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExtractCommandNameResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExtractCommandNameResult;
  static deserializeBinaryFromReader(message: ExtractCommandNameResult, reader: jspb.BinaryReader): ExtractCommandNameResult;
}

export namespace ExtractCommandNameResult {
  export type AsObject = {
    command: string,
    error: string,
  }
}

export class IsOperatorTokenRequest extends jspb.Message {
  getToken(): string;
  setToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IsOperatorTokenRequest.AsObject;
  static toObject(includeInstance: boolean, msg: IsOperatorTokenRequest): IsOperatorTokenRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: IsOperatorTokenRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IsOperatorTokenRequest;
  static deserializeBinaryFromReader(message: IsOperatorTokenRequest, reader: jspb.BinaryReader): IsOperatorTokenRequest;
}

export namespace IsOperatorTokenRequest {
  export type AsObject = {
    token: string,
  }
}

export class IsOperatorTokenResult extends jspb.Message {
  getIsOperator(): boolean;
  setIsOperator(value: boolean): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): IsOperatorTokenResult.AsObject;
  static toObject(includeInstance: boolean, msg: IsOperatorTokenResult): IsOperatorTokenResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: IsOperatorTokenResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): IsOperatorTokenResult;
  static deserializeBinaryFromReader(message: IsOperatorTokenResult, reader: jspb.BinaryReader): IsOperatorTokenResult;
}

export namespace IsOperatorTokenResult {
  export type AsObject = {
    isOperator: boolean,
    error: string,
  }
}

