import $_ from '@lexjs/prompts';

import { args } from './utils/args.js';
import { getArgs } from './utils/get-args.js';
import { getPackageJson } from './utils/get-package-json.js';

const { first, select } = args;
const { commandArgs: _ } = getArgs();

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

  const packageScripts = Object.entries(packageJson.scripts ?? {})
    // remove npm lifecycle hooks
    .filter(([key]) => !hooks.includes(key))
    // remove custom script lifecycle hooks
    .filter(
      ([key], i, array) =>
        !array.some(
          ([script]) => key === `pre${script}` || key === `post${script}`,
        ),
    )
    .map(([key, value]) => ({
      title: key,
      value: key,
      description: value,
    }));

  const matchedScripts = packageScripts.filter(
    ({ value }) => _.length === 0 || _.every(getMatchFn(value)),
  );

  if (matchedScripts.length === 0) {
    throw new Error('No matching scripts');
  }

  if (first) {
    return matchedScripts.at(0)?.value;
  }

  if (!select) {
    // find an exact script name match
    if (_.length === 1) {
      const [matchValue] = _;
      const exactMatch = matchedScripts.find(
        ({ value }) => value === matchValue,
      )?.value;

      if (exactMatch != null) {
        return exactMatch;
      }
    }

    // a single script name was matched
    if (matchedScripts.length === 1) {
      return matchedScripts.at(0)?.value;
    }
  }

  // an array of scripts was matched
  const { script } = await $_.autocomplete({
    name: 'script',
    message: 'Type to find a script',
    suggest(input: string | number, list) {
      const inputStr = `${input}`;
      const inputArr = inputStr.length === 0 ? _ : inputStr.split(/\s+/);
      return Promise.resolve(
        list.filter(({ title }) => inputArr.every(getMatchFn(title))),
      );
    },
    choices: packageScripts,
  });

  if (script != null) {
    return script;
  }

  return undefined;
}
