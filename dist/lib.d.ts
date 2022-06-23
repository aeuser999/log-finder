import { Attribute, Attributes, LogFinderRuleItem } from './types';
export declare function findMatchingChunkSlice(matchUntil: string | undefined, haystack: Attributes, attributeLength: number): Attribute[];
export declare const valuePredicate: (target: LogFinderRuleItem, value: string) => boolean;
