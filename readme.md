# @terra-money/log-finder

Generic pattern matcher for Terra transaction logs

## Installation

```
npm i @terra-money/log-finder
```

## Usage

### Defining log rules

Any log pattern is defined like below:

```typescript
export const createCW20TransferRule = (tokenAddress: string) => ({
  // type: must match with the log type
  type: 'from_contract',

  // attributes: list of attributes to be matched against log's key and value.
  // - index 0 and 1 are matched against key, value respectively.
  // - you can omit index 1 to match only using key; useful when the value is not static.
  // - you can also use callback as value `fn(string) => boolean`.
  attributes: [
    ['contract_address', tokenAddress],
    ['action', 'transfer'],
    ['from', (address) => address.startsWith('terra1')],
    ['to'],
    ['amount'],
  ],

  // (optional) forces log matcher to find an exact match; rule is no longer partial.
  strict: false,

  // (optional) matchUntil extends the matched chunk until another attribute (with the key being matchUntil) is found
  matchUntil: '...',
});
```

By default, log finder will match all logs that _contain_ the log rule. This allows your log rule to be partial to the logs you are looking for. This behaviour is useful in case of inter-contract execution; a contract A calling contract B, but you only know the specific log pattern emitted from contract B, and still want to match the logs.

You can also define an optional `strict` flag, forcing the log matcher to find an **exact** occurrence of the rule in the log.

### Callback pattern

Callback pattern is the default usage. Callback pattern is useful when you need to some transformation of the found logs as soon as they are found.

Note that the callback function is not `async`-able.

```typescript
// create a callback log finder
const logFinder = createLogFinder(
  // provide your rule
  createCW20TransferRule('terra1....'),

  // callback function to be called every time there is an occurrence
  // found: the entire log fragment that triggered callback fn
  // match: attributes that matched with the pattern you provided
  (found, match) => {
    // ... do something
  },
);

logFinder({
  type: 'from_contract',
  attriutes: [
    { key: '...', value: '...' },
    { key: '...', value: '...' },
  ],
});
```

### Return pattern

Returning pattern is a thin wrapper around callback pattern log finder. It allows you to treat log finder result as array of occurrences.

```typescript
// use createReturningLogFinder for this usage
const logFinder = createReturningLogFinder(
  // provide your rule
  createCW20TransferRule('terra1...'),

  // optional transformer function; whatever is returned from this function will be
  // included as `transformed` in the result
  (found, match) => {
    // return something
  },
);

const result = logFinder({
  type: 'from_contract',
  attriutes: [
    { key: '...', value: '...' },
    { key: '...', value: '...' },
  ],
});
```

# License

This software is licensed under the MIT license. See LICENSE for full disclosure.

© 2021 Terraform Labs, PTE.
