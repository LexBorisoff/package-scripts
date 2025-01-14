import { exec } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

import $_ from '@lexjs/prompts';

import { args } from './utils/args.js';
import { logger } from './utils/logger.js';

import type { PackageJson } from 'type-fest';

const { _ } = args;
const match = _.map((arg) => arg.toString());

function execCommand(command: string): void {
  const child = exec(`npm run ${command}`);
  child.stdout?.on('data', (data) => {
    process.stdout.write(data);
  });
  child.stderr?.on('error', (error) => {
    throw error;
  });
}

export async function pmRun(): Promise<void> {
  const filePath = path.resolve(process.cwd(), 'package.json');

  if (!fs.existsSync(filePath)) {
    logger.error('package.json does not exist in current directory');
    return;
  }

  const json = fs.readFileSync(filePath, {
    encoding: 'utf-8',
  });

  const contents: PackageJson = JSON.parse(json);

  if (contents.scripts == null || Object.keys(contents.scripts).length === 0) {
    logger.error('No scripts in package.json');
    return;
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
    logger.error('No matching scripts');
    return;
  }

  // a single script was matched
  if (choices.length === 1) {
    const [command] = choices;
    execCommand(command.value);
    return;
  }

  // an array of scripts was matched
  const { command } = await $_.autocomplete({
    name: 'command',
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

  if (command != null) {
    execCommand(command);
  }
}
