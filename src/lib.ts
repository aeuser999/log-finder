import { Attribute, Attributes, LogFinderRuleItem } from './types';

export function findMatchingChunkSlice(
  matchUntil: string | undefined,
  haystack: Attributes,
  attributeLength: number,
): Attribute[] {
  if (!matchUntil) {
    return haystack.slice(0, attributeLength);
  }

  const matchUntilIdx = haystack
    .slice(1)
    .findIndex((e) => e.key === matchUntil);

  return matchUntilIdx === -1 ? haystack : haystack.slice(0, matchUntilIdx + 1);
}

export const valuePredicate = (target: LogFinderRuleItem, value: string) => {
  switch (typeof target) {
    case 'string':
      return target === value;

    case 'function':
      return target(value);

    default:
      throw new Error(
        `Received unknown log finder value predicate, type ${target}`,
      );
  }
};
