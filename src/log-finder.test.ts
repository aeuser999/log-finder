import { LogFinderFn, LogFinderRule, LogFragment } from './types';
import { createLogFinder, createReturningLogFinder } from './log-finder';

test('log-finder/key-only', () => {
  const testLogFixture: LogFragment = {
    type: 'from_contract',
    attributes: [
      {
        key: 'test_key',
        value: '10000uusd',
      },
      {
        key: 'test_key2',
        value: 'terra1address',
      },
    ],
  };

  const testLogRule: LogFinderRule = {
    type: 'from_contract',
    attributes: [['test_key'], ['test_key2']],
  };

  const logFinderCallback: LogFinderFn = jest.fn((found, match) => {
    expect(match).toEqual(testLogFixture.attributes);
    expect(found.attributes).toEqual(testLogFixture.attributes);
    expect(found.type).toEqual(testLogRule.type);
  });
  const logFinder = createLogFinder(testLogRule, logFinderCallback);

  // run logFinder
  logFinder(testLogFixture);

  expect(logFinderCallback).toHaveBeenCalled();
});

test('log-finder/key-and-value', () => {
  const testLogFixture: LogFragment = {
    type: 'from_contract',
    attributes: [
      {
        key: 'test_key',
        value: '10000uusd',
      },
      {
        key: 'test_key2',
        value: 'terra1address',
      },
    ],
  };

  const testLogRule: LogFinderRule = {
    type: 'from_contract',
    attributes: [['test_key', '10000uusd'], ['test_key2']],
  };

  const logFinderCallback: LogFinderFn = jest.fn((found, match) => {
    expect(match).toEqual(testLogFixture.attributes);
    expect(found.attributes).toEqual(testLogFixture.attributes);
    expect(found.type).toEqual(testLogRule.type);
  });
  const logFinder = createLogFinder(testLogRule, logFinderCallback);

  // run logFinder
  logFinder(testLogFixture);

  expect(logFinderCallback).toHaveBeenCalled();
});

test('log-finder/partial-rule', () => {
  const testLogFixture: LogFragment = {
    type: 'from_contract',
    attributes: [
      {
        key: 'random_key',
        value: 'random_value',
      },
      {
        key: 'test_key',
        value: '10000uusd',
      },
      {
        key: 'test_key2',
        value: 'terra1address',
      },
      {
        key: 'random_key_after',
        value: 'random_value_after',
      },
    ],
  };

  const testLogRule: LogFinderRule = {
    type: 'from_contract',
    attributes: [['test_key', '10000uusd'], ['test_key2']],
  };

  const logFinderCallback: LogFinderFn = jest.fn((found, match) => {
    expect(match).toEqual(testLogFixture.attributes.slice(1, 3));
    expect(found.attributes).toEqual(testLogFixture.attributes);
    expect(found.type).toEqual(testLogRule.type);
  });
  const logFinder = createLogFinder(testLogRule, logFinderCallback);

  // run logFinder
  logFinder(testLogFixture);

  expect(logFinderCallback).toHaveBeenCalled();
});

test('log-finder/exact-rule-falsy', () => {
  const testLogFixture: LogFragment = {
    type: 'from_contract',
    attributes: [
      {
        key: 'random_key',
        value: 'random_value',
      },
      {
        key: 'test_key',
        value: '10000uusd',
      },
      {
        key: 'test_key2',
        value: 'terra1address',
      },
      {
        key: 'random_key_after',
        value: 'random_value_after',
      },
    ],
  };

  const testLogRule: LogFinderRule = {
    strict: true,
    type: 'from_contract',
    attributes: [['test_key', '10000uusd'], ['test_key2']],
  };

  const logFinderCallback: LogFinderFn = jest.fn(() => {
    // noop, should not be called
  });
  const logFinder = createLogFinder(testLogRule, logFinderCallback);

  // run logFinder
  logFinder(testLogFixture);

  // should never been called
  expect(logFinderCallback).toHaveBeenCalledTimes(0);
});

test('log-finder/exact-rule-truthy', () => {
  const testLogFixture: LogFragment = {
    type: 'from_contract',
    attributes: [
      {
        key: 'test_key',
        value: '10000uusd',
      },
      {
        key: 'test_key2',
        value: 'terra1address',
      },
    ],
  };

  const testLogRule: LogFinderRule = {
    strict: true,
    type: 'from_contract',
    attributes: [['test_key', '10000uusd'], ['test_key2']],
  };

  const logFinderCallback: LogFinderFn = jest.fn((found, match) => {
    expect(match).toEqual(testLogFixture.attributes);
    expect(found.attributes).toEqual(testLogFixture.attributes);
    expect(found.type).toEqual(testLogRule.type);
  });
  const logFinder = createLogFinder(testLogRule, logFinderCallback);

  // run logFinder
  logFinder(testLogFixture);
  expect(logFinderCallback).toHaveBeenCalledTimes(1);
});

test('log-finder/returning-log-finder', () => {
  const testLogFixture: LogFragment = {
    type: 'from_contract',
    attributes: [
      {
        key: 'test_key',
        value: '10000uusd',
      },
      {
        key: 'test_key2',
        value: 'terra1address',
      },
    ],
  };

  const testLogRule: LogFinderRule = {
    type: 'from_contract',
    attributes: [['test_key', '10000uusd'], ['test_key2']],
  };

  const logFinder = createReturningLogFinder(testLogRule);

  // run logFinder
  const result = logFinder(testLogFixture);

  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    match: testLogFixture.attributes,
    fragment: testLogFixture,
    transformed: undefined,
  });
});

test('log-finder/returning-log-finder-with-transformer', () => {
  const testLogFixture: LogFragment = {
    type: 'from_contract',
    attributes: [
      {
        key: 'test_key',
        value: '10000uusd',
      },
      {
        key: 'test_key2',
        value: 'terra1address',
      },
    ],
  };

  const testLogRule: LogFinderRule = {
    type: 'from_contract',
    attributes: [['test_key', '10000uusd'], ['test_key2']],
  };

  const logFinder = createReturningLogFinder(testLogRule, (fragment, match) => {
    expect(fragment).toEqual(testLogFixture);
    expect(match).toEqual(testLogFixture.attributes);

    return match[1];
  });

  // run logFinder
  const result = logFinder(testLogFixture);

  expect(result).toHaveLength(1);
  expect(result[0]).toEqual({
    match: testLogFixture.attributes,
    fragment: testLogFixture,
    transformed: testLogFixture.attributes[1],
  });
});

test('log-finder/invalid-pattern-shorter-than-rule', () => {
  const testLogFixture: LogFragment = {
    type: 'from_contract',
    attributes: [
      {
        key: 'test_key',
        value: '10000uusd',
      },
      {
        key: 'test_key2',
        value: 'terra1address',
      },
      {
        key: 'test_key3',
        value: 'terra1address',
      },
    ],
  };

  const testLogRule: LogFinderRule = {
    type: 'from_contract',
    attributes: [
      ['gibberish', 'asdfsadf'],
      ['test_key', '10000uusd'],
      ['test_key2'],
    ],
  };

  const logFinder = createReturningLogFinder(testLogRule, (fragment, match) => {
    expect(fragment).toEqual(testLogFixture);
    expect(match).toEqual(testLogFixture.attributes);

    return match[1];
  });

  // run logFinder
  const result = logFinder(testLogFixture);

  expect(result).toHaveLength(0);
});

test('log-finder/match-until', () => {
  const testLogFixture: LogFragment = {
    type: 'from_contract',
    attributes: [
      {
        key: 'skip',
        value: '...',
      },
      {
        key: 'test_key',
        value: '10000uusd',
      },
      {
        key: 'test_key2',
        value: 'terra1address',
      },
      {
        key: 'random1',
        value: 'terra1address',
      },
      {
        key: 'random2',
        value: 'terra1address',
      },
      {
        key: 'random3',
        value: 'terra1address',
      },
      {
        key: 'random4',
        value: 'terra1address',
      },
      {
        key: 'random5',
        value: 'terra1address',
      },
      {
        key: 'random6',
        value: 'terra1address',
      },
      {
        key: 'test_match_until',
        value: 'hello world',
      },
    ],
  };

  const testLogRule: LogFinderRule = {
    type: 'from_contract',
    attributes: [['test_key', '10000uusd'], ['test_key2']],
    matchUntil: 'test_match_until',
  };

  const logFinder = createReturningLogFinder(testLogRule);

  // run logFinder
  const result = logFinder(testLogFixture);

  expect(result).toHaveLength(1);
  expect(result[0].match).toEqual(testLogFixture.attributes.slice(1, -1));
});

test('log-finder/match-until-key-not-found', () => {
  const testLogFixture: LogFragment = {
    type: 'from_contract',
    attributes: [
      {
        key: 'skip',
        value: '...',
      },
      {
        key: 'test_key',
        value: '10000uusd',
      },
      {
        key: 'test_key2',
        value: 'terra1address',
      },
      {
        key: 'random1',
        value: 'terra1address',
      },
      {
        key: 'random2',
        value: 'terra1address',
      },
      {
        key: 'random3',
        value: 'terra1address',
      },
      {
        key: 'random4',
        value: 'terra1address',
      },
      {
        key: 'random5',
        value: 'terra1address',
      },
      {
        key: 'random6',
        value: 'terra1address',
      },
    ],
  };

  const testLogRule: LogFinderRule = {
    type: 'from_contract',
    attributes: [['test_key', '10000uusd'], ['test_key2']],
    matchUntil: 'test_match_until',
  };

  const logFinder = createReturningLogFinder(testLogRule);

  // run logFinder
  const result = logFinder(testLogFixture);

  expect(result).toHaveLength(1);
  expect(result[0].match).toEqual(testLogFixture.attributes.slice(1));
});

test('log-finder/match-using-callback', () => {
  const testLogFixture: LogFragment = {
    type: 'from_contract',
    attributes: [
      {
        key: 'test_key',
        value: '10000uusd',
      },
      {
        key: 'test_key2',
        value: 'terra1address',
      },
    ],
  };

  const testLogRule: LogFinderRule = {
    type: 'from_contract',
    attributes: [
      ['test_key', '10000uusd'],
      ['test_key2', (value) => value.startsWith('terra1')],
    ],
  };

  const logFinder = createReturningLogFinder(testLogRule);

  // run logFinder
  const result = logFinder(testLogFixture);

  expect(result).toHaveLength(1);
  expect(result[0].match).toEqual(testLogFixture.attributes);

  // failing case
  const testLogRule2: LogFinderRule = {
    type: 'from_contract',
    attributes: [
      ['test_key', '10000uusd'],
      ['test_key2', (value) => value.startsWith('terra2')],
    ],
  };

  const logFinder2 = createReturningLogFinder(testLogRule2);

  // run logFinder
  const result2 = logFinder2(testLogFixture);
  expect(result2).toHaveLength(0);
});

test('log-finder/dont-match-nullish-values', () => {
  const testLogFixture: LogFragment = {
    type: 'from_contract',
    attributes: [
      {
        key: 'test_key',
        value: '10000uusd',
      },
      {
        key: 'test_key2',
        value: 'terra1address',
      },
    ],
  };

  const testLogRule: LogFinderRule = {
    type: 'from_contract',
    attributes: [
      ['test_key', '10000uusd'],
      ['test_key2', ''],
    ],
  };

  const logFinder = createReturningLogFinder(testLogRule);

  // run logFinder
  const result2 = logFinder(testLogFixture);
  expect(result2).toHaveLength(0);
});
