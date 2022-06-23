export interface LogFragment {
    type: string;
    attributes: Attributes;
}
export interface Attribute {
    key: string;
    value: string;
}
export declare type Attributes = Attribute[];
export declare type LogFinderFn = (log: LogFragment, match: LogFragment['attributes']) => void;
export declare type LogFinderMapper = (log: LogFragment) => void;
export declare type LogFinderRuleItem = string | ((value: string) => boolean);
export interface LogFinderRule {
    type: string;
    attributes: LogFinderRuleItem[][];
    strict?: boolean;
    matchUntil?: string;
    chunkBy?: true;
}
export declare type ReturningLogFinderResult<T> = {
    fragment: LogFragment;
    match: LogFragment['attributes'];
    height?: number;
    transformed?: T;
    chunk?: Record<string, LogFragment['attributes'][]>;
};
export declare type ReturningLogFinderTransformer<T> = (fragment: LogFragment, match: LogFragment['attributes']) => T;
export declare type ReturningLogFinderMapper<T> = (event: LogFragment) => ReturningLogFinderResult<T>[];
