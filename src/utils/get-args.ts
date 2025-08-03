import { args } from '../args.js';

const toString = (value: string | number): string => `${value}`;
const _ = args._.map(toString);
const passThrough = args['--']?.map(toString);

export function getArgs(): {
  commandArgs: string[];
  passThroughArgs: string[];
} {
  if (passThrough != null) {
    return {
      commandArgs: _,
      passThroughArgs: passThrough,
    };
  }

  // split by triple-dash separator
  const index = _.indexOf('---');
  const commandArgs = index >= 0 ? _.slice(0, index) : _;
  const passThroughArgs = index >= 0 ? _.slice(index + 1) : [];

  return { commandArgs, passThroughArgs };
}
