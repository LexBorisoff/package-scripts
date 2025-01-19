import $_ from '@lexjs/prompts';

import { updateConfig } from '../config/update-config.js';

import { defaultManagers } from './default-managers.js';
import { getPackageManagers } from './get-package-managers.js';

import type { PackageManagerInterface } from '../types/package-manager.types.js';

export enum SelectPmReason {
  InitializeApp = 'initialize-app',
  Update = 'update',
}

function updateConfigManagers(
  command: string,
  packageManager: PackageManagerInterface,
): void {
  updateConfig(({ managers }) => ({
    managers: {
      ...managers,
      [command]: packageManager,
    },
  }));
}

function getPmChoices(): { title: string; value: string }[] {
  const managers = getPackageManagers();

  return Object.values(managers)
    .map(({ command }) => ({
      title: command,
      value: command,
    }))
    .concat({ title: 'other', value: 'other' });
}

/**
 * @param reason reason to select a package manager
 * @param command package manager command
 */
export async function selectPackageManager(
  reason: SelectPmReason,
  command?: string,
): Promise<PackageManagerInterface | undefined> {
  const managers = getPackageManagers();

  // command matches a manager from config
  if (command != null && command !== '' && managers[command] != null) {
    return managers[command];
  }

  // command is not provided
  if (command == null || command === '') {
    const initialMessage =
      reason === SelectPmReason.InitializeApp
        ? 'What is your default package manager?'
        : 'Select a package manager';

    const { packageManager } = await $_.autocomplete({
      name: 'packageManager',
      message: initialMessage,
      choices: getPmChoices(),
    });

    if (packageManager == null) {
      return undefined;
    }

    // manager was selected
    if (packageManager !== 'other') {
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

  if (!hasRunCommand) {
    const manager: PackageManagerInterface = { command, run: '' };
    updateConfigManagers(command, manager);
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
  updateConfigManagers(command, manager);
  return manager;
}
