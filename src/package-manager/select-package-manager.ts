import $_ from '@lexjs/prompts';

import { packageManagers } from './package-managers.js';

import type { PackageManagerInterface } from './package-manager.types.js';

export enum SelectPmReason {
  InitializeApp = 'initialize-app',
  Update = 'update',
}

export async function selectPackageManager(
  reason: SelectPmReason,
): Promise<PackageManagerInterface | undefined> {
  const { npm, pnpm, yarn, bun } = packageManagers;

  const initialMessage =
    reason === SelectPmReason.InitializeApp
      ? 'What package manager do you use?'
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

  const { command } = await $_.text({
    name: 'command',
    message: 'Type the package manager command',
  });

  if (command == null) {
    return undefined;
  }

  const { hasRunCommand } = await $_.toggle({
    name: 'hasRunCommand',
    message: `Does "${command}" have a command to run scripts?`,
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
