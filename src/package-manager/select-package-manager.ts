import $_ from '@lexjs/prompts';
import chalk from 'chalk';

import { PACKAGE_MANAGERS } from '../constants.js';
import { logger } from '../utils/logger.js';

import { getPmChoices } from './utils/get-pm-choices.js';

export enum SelectPmReason {
  InitializeApp = 'initialize-app',
  Update = 'update',
}

/**
 * @param reason reason to select a package manager
 * @param command initial package manager command
 */
export async function selectPackageManager(
  reason: SelectPmReason,
  command?: string,
): Promise<string | undefined> {
  // command matches a manager from config
  if (command != null && command !== '') {
    if (PACKAGE_MANAGERS.includes(command)) {
      return command;
    }

    logger.error(`! ${chalk.underline(command)} is not valid\n`);
  }

  const { packageManager } = await $_.select({
    name: 'packageManager',
    message:
      reason === SelectPmReason.InitializeApp
        ? 'What is your default package manager?'
        : 'Select a package manager',
    choices: getPmChoices(),
    suggest(input, list) {
      return Promise.resolve(list.filter(({ title }) => title.includes(input)));
    },
  });

  return packageManager;
}
