import { createTree, FsHooks } from 'fs-hooks';
import { coreHooks } from 'fs-hooks/core';

import { IS_DEV, IS_WINDOWS, PACKAGE_NAME, PATHS } from '../constants.js';
import { npmCommands, npmHooks } from '../hooks/npm-hooks.js';
import { initialTree } from '../hooks/tree.js';
import { packageManagers } from '../package-managers.js';
import { getScriptNames } from '../utils/get-script-names.js';

import { bashScript, powershellScript } from './script-contents.js';

const { npm } = packageManagers;

export async function initializeApp(command: string): Promise<void> {
  // create root tree
  const fsHooks = new FsHooks(PATHS.ROOT, initialTree);
  createTree(fsHooks);

  // create scripts
  const useCore = fsHooks.useHooks(coreHooks);
  const binDir = useCore((root) => root.bin);
  const { bash, powershell } = getScriptNames(command);
  binDir.fileCreate(bash, bashScript(npm));
  if (IS_WINDOWS) {
    binDir.fileCreate(powershell, powershellScript(npm));
  }

  // install package
  const npmCommand = IS_DEV ? npmCommands.link : npmCommands.install;
  const useNpm = fsHooks.useHooks(npmHooks);
  await useNpm(({ lib }) => lib)[npmCommand]([PACKAGE_NAME]);
}
