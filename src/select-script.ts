import $_ from '@lexjs/prompts';

import { args } from './utils/args.js';
import { getPackageJson } from './utils/get-package-json.js';

const { _, exact } = args;
const match = _.map((arg) => arg.toString());

function getMatchFn(script: string) {
  return (value: string) => script.toLowerCase().includes(value.toLowerCase());
}

export async function selectScript(): Promise<string | undefined> {
  const packageJson = getPackageJson();

  if (
    packageJson.scripts == null ||
    Object.keys(packageJson.scripts).length === 0
  ) {
    throw new Error('No scripts in package.json');
  }

  const lifecycle = [
    'install',
    'pack',
    'publish',
    'restart',
    'start',
    'stop',
    'test',
    'uninstall',
    'version',
  ];

  const hooks = ['pre', 'post']
    .reduce<
      string[]
    >((acc, hook) => [...acc, ...lifecycle.map((e) => `${hook}${e}`)], [])
    .concat('prepare', 'prepublishOnly');

  const choices = Object.entries(packageJson.scripts ?? {})
    // remove npm lifecycle hooks
    .filter(([key]) => !hooks.includes(key))
    // remove custom script lifecycle hooks
    .filter(
      ([key], i, array) =>
        !array.some(
          ([script]) => key === `pre${script}` || key === `post${script}`,
        ),
    )
    .filter(([key]) => match.length === 0 || match.every(getMatchFn(key)))
    .map(([key, value]) => ({
      title: key,
      value: key,
      description: value,
    }));

  if (choices.length === 0) {
    throw new Error('No matching scripts');
  }

  // a single script was matched
  if (choices.length === 1) {
    const [script] = choices;
    return script.value;
  }

  // an exact script name was matched
  if (exact && match.length === 1) {
    const [matchValue] = match;
    const exactMatch = choices.find(({ value }) => value === matchValue)?.value;

    if (exactMatch != null) {
      return exactMatch;
    }
  }

  // an array of scripts was matched
  const { script } = await $_.autocomplete({
    name: 'script',
    message: 'Type to find a script',
    suggest(input: string | number, list) {
      const inputArray = `${input}`.split(/\s+/);
      return Promise.resolve(
        list.filter(({ title }) => inputArray.every(getMatchFn(title))),
      );
    },
    choices,
  });

  if (script != null) {
    return script;
  }

  return undefined;
}
