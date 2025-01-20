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

function removeFromConfig(managers: string[]): void {
  updateConfig((config) => {
    const updated = Object.entries(config.managers).reduce<
      Record<string, PackageManagerInterface>
    >((acc, [key, manager]) => {
      if (!managers.includes(manager.command)) {
        const result = { ...acc, [key]: manager };
        return result;
      }
      return acc;
    }, {});

    return { managers: updated };
  });

  pmLogger.remove(managers);
}

export async function removePackageManager(arg: string): Promise<void> {
  const managers = getConfigData().managers;
  const currentManager = getConfigData().packageManager;

  if (Object.keys(managers).length === 0) {
    logger.warn('No package managers to remove');
    return;
  }

  let managersToRemove: string[] = [];
  const pmChoices = getPmChoices(managers, false);
  const matches = pmChoices.filter(({ value }) => value.includes(arg));

  // command matches a manager from config
  if (arg !== '' && managers[arg] != null) {
    managersToRemove = [arg];
  }
  // select managers to remove
  else {
    const { selected } = await $_.autocompleteMultiselect({
      name: 'selected',
      message: 'Select package managers to remove',
      choices: matches,
      instructions: false,
    });

    if (selected == null) {
      return;
    }

    managersToRemove = selected;
  }

  // select a new package manager if current is being removed
  if (managersToRemove.includes(currentManager.command)) {
    logger.warn(
      `Default package manager "${currentManager.command}" is being removed`,
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
