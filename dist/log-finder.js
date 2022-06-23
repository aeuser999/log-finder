"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReturningLogFinder = exports.createLogFinder = void 0;
var lib_1 = require("./lib");
// these conditions should be met for a log entry to be a match
var occurenceRule = function (src, target) {
    return [
        // key match
        target[0] === src.key,
        // value match IF value is given, otherwise true
        typeof target[1] !== 'undefined'
            ? lib_1.valuePredicate(target[1], src.value)
            : true,
    ].every(function (predicate) { return predicate; });
};
var createLogFinder = function (logFindRule, callback) {
    return function (fragment) {
        // if type is not a match, skip
        if (fragment.type !== logFindRule.type)
            return;
        //
        var logFindRuleLength = logFindRule.attributes.length;
        // next haystack slicer;
        // in case "strict" option is given, it MUST be an exact match.
        // i.e. all keys and values should match from idx 0;
        // so in case if this is called again, just return an empty array
        // to force next doFind() call to return undefined
        var nextHaystack = function (haystack, sliceBy) {
            return logFindRule.strict ? [] : haystack.slice(sliceBy);
        };
        var doFind = function (haystack) {
            // return if haystack size is 0
            if (haystack.length === 0)
                return;
            // find match using occurrenceRule
            var slicedHaystack = haystack.slice(0, logFindRuleLength);
            // if sliced haystack is shorter than the log find rule,
            // then it won't be a batch
            if (slicedHaystack.length < logFindRuleLength)
                return;
            var match = slicedHaystack.every(function (attribute, i) {
                return occurenceRule(attribute, logFindRule.attributes[i]);
            });
            // call callback if match is found
            if (match) {
                var matchingChunk = lib_1.findMatchingChunkSlice(logFindRule.matchUntil, haystack, logFindRuleLength);
                // create exact matching attributes, send it through callback
                callback(fragment, matchingChunk);
                doFind(nextHaystack(haystack, logFindRuleLength));
            }
            else {
                // move forward
                doFind(nextHaystack(haystack, 1));
            }
        };
        doFind(fragment.attributes);
    };
};
exports.createLogFinder = createLogFinder;
var createReturningLogFinder = function (logFindRule, transform) {
    return function (event) {
        return resultIoC(function (onLogFound) {
            return exports.createLogFinder(logFindRule, function (log, match) {
                return onLogFound({
                    match: match,
                    fragment: log,
                    transformed: transform ? transform(log, match) : undefined,
                });
            })(event);
        });
    };
};
exports.createReturningLogFinder = createReturningLogFinder;
function resultIoC(iocHandle) {
    var resultVector = [];
    iocHandle(function (result) { return resultVector.push(result); });
    return resultVector;
}
//# sourceMappingURL=log-finder.js.map