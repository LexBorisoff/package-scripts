import { createTree, FsHooks } from 'fs-hooks';
import { coreHooks } from 'fs-hooks/core';

import { isWindows, packageName, rootPath } from '../constants.js';
import { npmHooks } from '../hooks/npm-hooks.js';

import { bash, powershell, sourceBash } from './script-contents.js';

export async function initializeApp(cmdName: string): Promise<void> {
  const fsHooks = new FsHooks(rootPath, {
    lib: {},
    tmp: {
      script: '',
      manager: 'npm run',
    },
    bash: {
      [`${cmdName}.sh`]: bash(cmdName),
    },
    'source.sh': sourceBash,
  });

  createTree(fsHooks);

  if (isWindows) {
    // create .ps1 scripts for windows
    const useCore = fsHooks.useHooks(coreHooks);
    const binDir = useCore((root) => root).dirCreate('bin');

    if (binDir) {
      binDir.fileCreate(`${cmdName}.ps1`, powershell);
    }
  }

  const useNpm = fsHooks.useHooks({ dir: npmHooks });
  await useNpm(({ lib }) => lib).link([packageName]);
}
