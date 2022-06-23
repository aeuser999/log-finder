export interface LogFragment {
  type: string;
  attributes: Attributes;
}

export interface Attribute {
  key: string;
  value: string;
}

export type Attributes = Attribute[];

export type LogFinderFn = (
  log: LogFragment,
  match: LogFragment['attributes'],
) => void;
export type LogFinderMapper = (log: LogFragment) => void;

// rule related types
export type LogFinderRuleItem = string | ((value: string) => boolean);
export interface LogFinderRule {
  type: string;
  attributes: LogFinderRuleItem[][];
  strict?: boolean;

  // match until changes the behaviour of matcher so the matched chunk includes everything until the next occurrence of matchUntil key
  matchUntil?: string;

  // chunkBy chunks fragment into chunks where the keys are <chunkBy>
  chunkBy?: true;
}

// returning log finder is a pattern using the usual callback-pattern underneath
// the return could be either null OR a found log
export type ReturningLogFinderResult<T> = {
  fragment: LogFragment;
  match: LogFragment['attributes'];
  height?: number;
  transformed?: T;
  chunk?: Record<string, LogFragment['attributes'][]>;
};

export type ReturningLogFinderTransformer<T> = (
  fragment: LogFragment,
  match: LogFragment['attributes'],
) => T;

export type ReturningLogFinderMapper<T> = (
  event: LogFragment,
) => ReturningLogFinderResult<T>[];
