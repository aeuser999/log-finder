import { findMatchingChunkSlice, valuePredicate } from './lib';
import {
  Attributes,
  LogFinderFn,
  LogFinderMapper,
  LogFinderRule,
  LogFragment,
  ReturningLogFinderMapper,
  ReturningLogFinderResult,
  ReturningLogFinderTransformer,
} from './types';

// these conditions should be met for a log entry to be a match
const occurenceRule = (
  src: Attributes[0],
  target: LogFinderRule['attributes'][0],
) =>
  [
    // key match
    target[0] === src.key,

    // value match IF value is given, otherwise true
    typeof target[1] !== 'undefined'
      ? valuePredicate(target[1], src.value)
      : true,
  ].every((predicate) => predicate);

export const createLogFinder =
  (logFindRule: LogFinderRule, callback: LogFinderFn): LogFinderMapper =>
  (fragment: LogFragment) => {
    // if type is not a match, skip
    if (fragment.type !== logFindRule.type) return;

    //
    const logFindRuleLength = logFindRule.attributes.length;

    // next haystack slicer;
    // in case "strict" option is given, it MUST be an exact match.
    // i.e. all keys and values should match from idx 0;
    // so in case if this is called again, just return an empty array
    // to force next doFind() call to return undefined
    const nextHaystack = (haystack: Attributes, sliceBy: number) =>
      logFindRule.strict ? [] : haystack.slice(sliceBy);

    const doFind = (haystack: Attributes) => {
      // return if haystack size is 0
      if (haystack.length === 0) return;

      // find match using occurrenceRule
      const slicedHaystack = haystack.slice(0, logFindRuleLength);

      // if sliced haystack is shorter than the log find rule,
      // then it won't be a batch
      if (slicedHaystack.length < logFindRuleLength) return;

      const match = slicedHaystack.every((attribute, i) =>
        occurenceRule(attribute, logFindRule.attributes[i]),
      );

      // call callback if match is found
      if (match) {
        const matchingChunk = findMatchingChunkSlice(
          logFindRule.matchUntil,
          haystack,
          logFindRuleLength,
        );

        // create exact matching attributes, send it through callback
        callback(fragment, matchingChunk);
        doFind(nextHaystack(haystack, logFindRuleLength));
      } else {
        // move forward
        doFind(nextHaystack(haystack, 1));
      }
    };

    doFind(fragment.attributes);
  };

export const createReturningLogFinder =
  <TransformOutputType = any>(
    logFindRule: LogFinderRule,
    transform?: ReturningLogFinderTransformer<TransformOutputType>,
  ): ReturningLogFinderMapper<TransformOutputType> =>
  (event: LogFragment) =>
    resultIoC<TransformOutputType>((onLogFound) =>
      createLogFinder(logFindRule, (log, match) =>
        onLogFound({
          match,
          fragment: log,
          transformed: transform ? transform(log, match) : undefined,
        }),
      )(event),
    );

function resultIoC<TransformOutputType>(
  iocHandle: (
    onLogFound: (result: ReturningLogFinderResult<TransformOutputType>) => void,
  ) => void,
): ReturningLogFinderResult<TransformOutputType>[] {
  const resultVector: ReturningLogFinderResult<TransformOutputType>[] = [];
  iocHandle((result) => resultVector.push(result));
  return resultVector;
}
