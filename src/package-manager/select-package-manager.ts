import $_ from '@lexjs/prompts';
import chalk from 'chalk';

import { logger } from '../utils/logger.js';

import { defaultManagers } from './default-managers.js';
import { getPmChoices } from './utils/get-pm-choices.js';

import type {
  PackageManagerChoice,
  PackageManagerInterface,
} from '../types/package-manager.types.js';

export enum SelectPmReason {
  InitializeApp = 'initialize-app',
  Update = 'update',
}

export interface SelectOptions {
  /**
   * package manager command
   */
  command?: string;
  /**
   * choices to override for selection
   */
  choices?: PackageManagerChoice[];
}

/**
 * @param reason reason to select a package manager
 */
export async function selectPackageManager(
  reason: SelectPmReason,
  { command, choices }: SelectOptions = {},
): Promise<PackageManagerInterface | undefined> {
  // command matches a manager from config
  if (command != null && command !== '') {
    if (defaultManagers[command] != null) {
      return defaultManagers[command];
    }

    logger.warn(
      `${chalk.bold.italic(command)} does not match a package manager`,
    );
  }

  const { packageManager } = await $_.autocomplete({
    name: 'packageManager',
    message:
      reason === SelectPmReason.InitializeApp
        ? 'What is your default package manager?'
        : 'Select a package manager',
    choices: choices ?? getPmChoices(),
    suggest(input, list) {
      return Promise.resolve(list.filter(({ title }) => title.includes(input)));
    },
  });

  if (packageManager == null) {
    return undefined;
  }

  return defaultManagers[packageManager];
}
