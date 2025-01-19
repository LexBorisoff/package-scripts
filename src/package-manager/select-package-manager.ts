import $_ from '@lexjs/prompts';

import { packageManagers } from './package-managers.js';

import type { PackageManagerInterface } from '../types/package-manager.types.js';

export enum SelectPmReason {
  InitializeApp = 'initialize-app',
  Update = 'update',
}

/**
 * @param reason reason to select a package manager
 * @param command package manager command
 */
export async function selectPackageManager(
  reason: SelectPmReason,
  command?: string,
): Promise<PackageManagerInterface | undefined> {
  const { npm, pnpm, yarn, bun } = packageManagers;

  if (command != null && command !== '' && packageManagers[command] != null) {
    return packageManagers[command];
  }

  if (command == null || command === '') {
    const initialMessage =
      reason === SelectPmReason.InitializeApp
        ? 'What is your default package manager?'
        : 'Select a package manager';

    const { packageManager } = await $_.autocomplete({
      name: 'packageManager',
      message: initialMessage,
      choices: [
        { title: npm.command, value: npm.command },
        { title: pnpm.command, value: pnpm.command },
        { title: yarn.command, value: yarn.command },
        { title: bun.command, value: bun.command },
        { title: 'other', value: 'other' },
      ],
    });

    if (packageManager == null) {
      return undefined;
    }

    if (packageManager !== 'other') {
      return packageManagers[packageManager];
    }

    const { customCommand } = await $_.text({
      name: 'customCommand',
      message: 'Type the package manager command',
    });

    if (customCommand == null) {
      return undefined;
    }

    command = customCommand;
  }

  const { hasRunCommand } = await $_.toggle({
    name: 'hasRunCommand',
    message: `Does "${command}" have a command to run scripts?`,
    initial: true,
  });

  if (!hasRunCommand) {
    return { command, run: '' };
  }

  const { run } = await $_.text({
    name: 'run',
    message: `Type the command to run scripts using "${command}"`,
    initial: 'run',
  });

  if (!run) {
    return undefined;
  }

  return { command, run };
}
