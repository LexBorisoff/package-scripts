import * as fs from 'node:fs';
import * as path from 'node:path';

import $_ from '@lexjs/prompts';

import { args } from './utils/args.js';

import type { PackageJson } from 'type-fest';

const { _ } = args;
const match = _.map((arg) => arg.toString());

export async function selectScript(): Promise<string | undefined> {
  const filePath = path.resolve(process.cwd(), 'package.json');

  if (!fs.existsSync(filePath)) {
    throw new Error('package.json does not exist in current directory');
  }

  const json = fs.readFileSync(filePath, {
    encoding: 'utf-8',
  });

  const contents: PackageJson = JSON.parse(json);

  if (contents.scripts == null || Object.keys(contents.scripts).length === 0) {
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

  const choices = Object.entries(contents.scripts ?? {})
    // remove npm lifecycle hooks
    .filter(([key]) => !hooks.includes(key))
    // remove custom script lifecycle hooks
    .filter(
      ([key], i, array) =>
        !array.some(
          ([script]) => key === `pre${script}` || key === `post${script}`,
        ),
    )
    .filter(
      ([key]) =>
        match.length === 0 || match.every((value) => key.includes(value)),
    )
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

  // an array of scripts was matched
  const { script } = await $_.autocomplete({
    name: 'script',
    message: 'Type to find a script',
    suggest(input: string | number, list) {
      return Promise.resolve(
        list.filter(({ title }) =>
          title.toLowerCase().includes(input.toString().toLowerCase()),
        ),
      );
    },
    choices,
  });

  if (script != null) {
    return script;
  }

  return undefined;
}