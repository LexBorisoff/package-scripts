import { createTree, FsHooks } from 'fs-hooks';
import { coreHooks } from 'fs-hooks/core';

import { defaultPm, isWindows, packageName, rootPath } from '../constants.js';
import { npmHooks } from '../hooks/npm-hooks.js';

import { bash, powershell } from './script-contents.js';

export async function initializeApp(command: string): Promise<void> {
  const fsHooks = new FsHooks(rootPath, {
    lib: {},
    tmp: {
      script: '',
    },
  });

  createTree(fsHooks);

  const useCore = fsHooks.useHooks(coreHooks);

  const bashScript = bash({ command, ...defaultPm });
  useCore((root) => root).fileCreate(`${command}.sh`, bashScript);

  if (isWindows) {
    const binDir = useCore((root) => root).dirCreate('bin');

    if (binDir) {
      binDir.fileCreate(`${command}.ps1`, powershell(defaultPm));
    }
  }

  const useNpm = fsHooks.useHooks({ dir: npmHooks });
  await useNpm(({ lib }) => lib).link([packageName]);
}
