import $_ from '@lexjs/prompts';

import { updateConfig } from '../config/update-config.js';

import { defaultManagers } from './default-managers.js';
import { getPackageManagers } from './utils/get-package-managers.js';
import { getPmChoices, NEW_PM_OPTION } from './utils/get-pm-choices.js';

import type {
  PackageManagerChoice,
  PackageManagerInterface,
} from '../types/package-manager.types.js';

export enum SelectPmReason {
  InitializeApp = 'initialize-app',
  Update = 'update',
}

function updateConfigManagers(packageManager: PackageManagerInterface): void {
  updateConfig(({ managers }) => ({
    managers: {
      ...managers,
      [packageManager.command]: packageManager,
    },
  }));
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
  const managers = getPackageManagers();

  // command matches a manager from config
  if (command != null && command !== '' && managers[command] != null) {
    return managers[command];
  }

  // command is not provided
  if (command == null || command === '') {
    const { packageManager } = await $_.autocomplete({
      name: 'packageManager',
      message:
        reason === SelectPmReason.InitializeApp
          ? 'What is your default package manager?'
          : 'Select a package manager',
      choices: choices ?? getPmChoices(managers),
    });

    if (packageManager == null) {
      return undefined;
    }

    // manager was selected
    if (packageManager !== NEW_PM_OPTION) {
      return managers[packageManager];
    }

    // other manager
    const { otherCommand } = await $_.text({
      name: 'otherCommand',
      message: 'Type the package manager command',
    });

    if (otherCommand == null) {
      return undefined;
    }

    // entered command is a default manager
    if (defaultManagers[otherCommand] != null) {
      return defaultManagers[otherCommand];
    }

    command = otherCommand;
  }

  // custom manager
  const { hasRunCommand } = await $_.toggle({
    name: 'hasRunCommand',
    message: `Does "${command}" have a command to run scripts?`,
    initial: true,
  });

  if (hasRunCommand == null) {
    return undefined;
  }

  if (!hasRunCommand) {
    const manager: PackageManagerInterface = { command, run: '' };
    updateConfigManagers(manager);
    return manager;
  }

  const { run } = await $_.text({
    name: 'run',
    message: `Type the command to run scripts using "${command}"`,
    initial: 'run',
  });

  if (!run) {
    return undefined;
  }

  const manager: PackageManagerInterface = { command, run };
  updateConfigManagers(manager);
  return manager;
}
