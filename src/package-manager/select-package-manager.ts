import $_ from '@lexjs/prompts';
import chalk from 'chalk';

import { PACKAGE_MANAGERS } from '../constants.js';
import { logger } from '../utils/logger.js';

import { getPmChoices } from './utils/get-pm-choices.js';

export enum SelectPmEnum {
  DefaultPm = 'default',
  SelectPm = 'select',
}

/**
 * @param reason reason to select a package manager
 */
export async function selectPackageManager(
  reason: SelectPmEnum,
  command?: string,
): Promise<string | undefined> {
  // command matches a manager from config
  if (command != null && command !== '') {
    if (PACKAGE_MANAGERS.includes(command)) {
      return command;
    }

    logger.error(`! ${chalk.underline(command)} is not valid\n`);
  }

  const { packageManager } = await $_.autocomplete({
    name: 'packageManager',
    message:
      reason === SelectPmEnum.DefaultPm
        ? 'What is your default package manager?'
        : 'Select a package manager',
    choices: getPmChoices(),
    suggest(input, list) {
      return Promise.resolve(list.filter(({ title }) => title.includes(input)));
    },
  });

  return packageManager;
}
