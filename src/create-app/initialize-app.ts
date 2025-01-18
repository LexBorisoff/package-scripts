import { createTree, FsHooks } from 'fs-hooks';
import { coreHooks } from 'fs-hooks/core';

import { IS_DEV, IS_WINDOWS, PACKAGE_NAME, PATHS } from '../constants.js';
import { npmCommands, npmHooks } from '../hooks/npm-hooks.js';
import { packageManagers } from '../package-managers.js';

import { bashScript, powershellScript } from './script-contents.js';

const { npm } = packageManagers;

export async function initializeApp(command: string): Promise<void> {
  const fsHooks = new FsHooks(PATHS.ROOT, {
    lib: {},
    bin: {},
    tmp: {
      script: '',
    },
  });

  createTree(fsHooks);

  const useCore = fsHooks.useHooks(coreHooks);
  const binDir = useCore((root) => root.bin);

  binDir.fileCreate(command, bashScript(npm));
  if (IS_WINDOWS) {
    binDir.fileCreate(`${command}.ps1`, powershellScript(npm));
  }

  const useNpm = fsHooks.useHooks({ dir: npmHooks });

  const npmCommand: keyof typeof npmCommands = IS_DEV
    ? npmCommands.link
    : npmCommands.install;

  await useNpm(({ lib }) => lib)[npmCommand]([PACKAGE_NAME]);
}
