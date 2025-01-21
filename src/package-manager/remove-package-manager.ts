import $_ from '@lexjs/prompts';

import { getConfigData } from '../config/get-config-data.js';
import { updateConfig } from '../config/update-config.js';
import { logger } from '../utils/logger.js';

import {
  selectPackageManager,
  SelectPmReason,
} from './select-package-manager.js';
import { getPackageManagers } from './utils/get-package-managers.js';
import { getPmChoices } from './utils/get-pm-choices.js';
import { pmLogger } from './utils/pm-logger.js';

import type { PackageManagerInterface } from '../types/package-manager.types.js';

function removeFromConfig(pmCommands: string[]): void {
  updateConfig((config) => {
    const managers = Object.entries(config.managers).reduce<
      Record<string, PackageManagerInterface>
    >((acc, [key, manager]) => {
      if (!pmCommands.includes(manager.command)) {
        const result = { ...acc, [key]: manager };
        return result;
      }
      return acc;
    }, {});

    return { managers };
  });

  pmLogger.remove(pmCommands);
}

export async function removePackageManager(arg: string): Promise<void> {
  const { managers, packageManager } = getConfigData();

  if (Object.keys(managers).length === 0) {
    logger.warn('No package managers to remove');
    return;
  }

  let managersToRemove: string[] = [];

  // command matches a manager from config
  if (arg !== '' && managers[arg] != null) {
    managersToRemove = [arg];
  }
  // select managers to remove
  else {
    const pmChoices = getPmChoices(managers, false);

    const { selected } = await $_.autocompleteMultiselect({
      name: 'selected',
      message: 'Select package managers to remove',
      choices: pmChoices.filter(({ value }) => value.includes(arg)),
      instructions: false,
      suggest(input, list) {
        return Promise.resolve(
          list.filter(({ title }) => title.includes(input)),
        );
      },
    });

    if (selected == null || selected.length === 0) {
      return;
    }

    managersToRemove = selected;
  }

  // select a new package manager if current is being removed
  if (managersToRemove.includes(packageManager.command)) {
    logger.warn(
      `Default package manager "${packageManager.command}" is being removed`,
    );
    logger.log('');

    // construct remaining managers
    const remainingManagers = getPackageManagers();
    Object.keys(managers).forEach((key) => {
      if (managersToRemove.includes(key)) {
        delete remainingManagers[key];
      }
    });

    const newCurrentManager = await selectPackageManager(
      SelectPmReason.Update,
      { choices: getPmChoices(remainingManagers) },
    );

    if (newCurrentManager == null) {
      return;
    }

    updateConfig({ packageManager: newCurrentManager });
    pmLogger.use(newCurrentManager);
  }

  removeFromConfig(managersToRemove);
}
