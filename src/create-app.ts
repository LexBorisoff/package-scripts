import os from 'node:os';
import path from 'node:path';

import $_ from '@lexjs/prompts';
import { $, ExecaError } from 'execa';
import { FsHooks, createTree } from 'fs-hooks';

import { logger } from './utils/logger.js';

const rootPath = path.resolve(os.homedir(), 'pm-run-script');

const dirHooks = FsHooks.dirHooks((targetDir) => ({
  async installDeps(deps: string[]) {
    const currentDir = process.cwd();
    process.chdir(targetDir.path);

    try {
      await $`npm i ${deps.join(' ')}`;
    } catch (error) {
      if (error instanceof ExecaError) {
        logger.error(error.message);
      }

      process.chdir(currentDir);
    }
  },
}));

async function createApp(): Promise<void> {
  const { cmdName } = await $_.text({
    name: 'cmdName',
    message: 'Create the command name',
    initial: 'pmrun',
  });

  if (cmdName != null) {
    // TODO: check if command exists in the system

    const fsHooks = new FsHooks(rootPath, {
      bin: {
        [cmdName]: `#!/usr/bin/env sh`,
        [`${cmdName}.ps1`]: `#!/usr/bin/env pwsh`,
      },
      lib: {},
    });

    createTree(fsHooks);

    const hooks = fsHooks.useHooks({ dir: dirHooks });
    await hooks((root) => root.lib).installDeps(['pm-run-script']);
  }
}

createApp();
