"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log_finder_1 = require("./log-finder");
test("log-finder/key-only", function () {
    var testLogFixture = {
        type: "from_contract",
        attributes: [
            {
                key: "test_key",
                value: "10000uusd",
            },
            {
                key: "test_key2",
                value: "terra1address",
            },
        ],
    };
    var testLogRule = {
        type: "from_contract",
        attributes: [["test_key"], ["test_key2"]],
    };
    var logFinderCallback = jest.fn(function (found, match) {
        expect(match).toEqual(testLogFixture.attributes);
        expect(found.attributes).toEqual(testLogFixture.attributes);
        expect(found.type).toEqual(testLogRule.type);
    });
    var logFinder = log_finder_1.createLogFinder(testLogRule, logFinderCallback);
    // run logFinder
    logFinder(testLogFixture);
    expect(logFinderCallback).toHaveBeenCalled();
});
test("log-finder/key-and-value", function () {
    var testLogFixture = {
        type: "from_contract",
        attributes: [
            {
                key: "test_key",
                value: "10000uusd",
            },
            {
                key: "test_key2",
                value: "terra1address",
            },
        ],
    };
    var testLogRule = {
        type: "from_contract",
        attributes: [["test_key", "10000uusd"], ["test_key2"]],
    };
    var logFinderCallback = jest.fn(function (found, match) {
        expect(match).toEqual(testLogFixture.attributes);
        expect(found.attributes).toEqual(testLogFixture.attributes);
        expect(found.type).toEqual(testLogRule.type);
    });
    var logFinder = log_finder_1.createLogFinder(testLogRule, logFinderCallback);
    // run logFinder
    logFinder(testLogFixture);
    expect(logFinderCallback).toHaveBeenCalled();
});
test("log-finder/partial-rule", function () {
    var testLogFixture = {
        type: "from_contract",
        attributes: [
            {
                key: "random_key",
                value: "random_value",
            },
            {
                key: "test_key",
                value: "10000uusd",
            },
            {
                key: "test_key2",
                value: "terra1address",
            },
            {
                key: "random_key_after",
                value: "random_value_after",
            },
        ],
    };
    var testLogRule = {
        type: "from_contract",
        attributes: [["test_key", "10000uusd"], ["test_key2"]],
    };
    var logFinderCallback = jest.fn(function (found, match) {
        expect(match).toEqual(testLogFixture.attributes.slice(1, 3));
        expect(found.attributes).toEqual(testLogFixture.attributes);
        expect(found.type).toEqual(testLogRule.type);
    });
    var logFinder = log_finder_1.createLogFinder(testLogRule, logFinderCallback);
    // run logFinder
    logFinder(testLogFixture);
    expect(logFinderCallback).toHaveBeenCalled();
});
test("log-finder/exact-rule-falsy", function () {
    var testLogFixture = {
        type: "from_contract",
        attributes: [
            {
                key: "random_key",
                value: "random_value",
            },
            {
                key: "test_key",
                value: "10000uusd",
            },
            {
                key: "test_key2",
                value: "terra1address",
            },
            {
                key: "random_key_after",
                value: "random_value_after",
            },
        ],
    };
    var testLogRule = {
        exact: true,
        type: "from_contract",
        attributes: [["test_key", "10000uusd"], ["test_key2"]],
    };
    var logFinderCallback = jest.fn(function () {
        // noop, should not be called
    });
    var logFinder = log_finder_1.createLogFinder(testLogRule, logFinderCallback);
    // run logFinder
    logFinder(testLogFixture);
    // should never been called
    expect(logFinderCallback).toHaveBeenCalledTimes(0);
});
test("log-finder/exact-rule-truthy", function () {
    var testLogFixture = {
        type: "from_contract",
        attributes: [
            {
                key: "test_key",
                value: "10000uusd",
            },
            {
                key: "test_key2",
                value: "terra1address",
            },
        ],
    };
    var testLogRule = {
        exact: true,
        type: "from_contract",
        attributes: [["test_key", "10000uusd"], ["test_key2"]],
    };
    var logFinderCallback = jest.fn(function (found, match) {
        expect(match).toEqual(testLogFixture.attributes);
        expect(found.attributes).toEqual(testLogFixture.attributes);
        expect(found.type).toEqual(testLogRule.type);
    });
    var logFinder = log_finder_1.createLogFinder(testLogRule, logFinderCallback);
    // run logFinder
    logFinder(testLogFixture);
    // should never been called
    expect(logFinderCallback).toHaveBeenCalledTimes(1);
});
//# sourceMappingURL=log-finder.test.js.map