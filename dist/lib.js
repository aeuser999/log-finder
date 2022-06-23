"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.valuePredicate = exports.findMatchingChunkSlice = void 0;
function findMatchingChunkSlice(matchUntil, haystack, attributeLength) {
    if (!matchUntil) {
        return haystack.slice(0, attributeLength);
    }
    var matchUntilIdx = haystack
        .slice(1)
        .findIndex(function (e) { return e.key === matchUntil; });
    return matchUntilIdx === -1 ? haystack : haystack.slice(0, matchUntilIdx + 1);
}
exports.findMatchingChunkSlice = findMatchingChunkSlice;
var valuePredicate = function (target, value) {
    switch (typeof target) {
        case 'string':
            return target === value;
        case 'function':
            return target(value);
        default:
            throw new Error("Received unknown log finder value predicate, type " + target);
    }
};
exports.valuePredicate = valuePredicate;
//# sourceMappingURL=lib.js.map