import { createTree, FsHooks } from 'fs-hooks';
import { coreHooks } from 'fs-hooks/core';

import { IS_DEV, IS_WINDOWS, PACKAGE_NAME, PATHS } from '../constants.js';
import { npmCommands, npmHooks } from '../hooks/npm-hooks.js';
import { initialTree } from '../hooks/tree.js';
import { getScriptNames } from '../utils/get-script-names.js';

import { bashScript, powershellScript } from './script-contents.js';

import type { PackageManagerInterface } from '../package-manager/package-manager.types.js';

export async function initializeApp(
  command: string,
  packageManager: PackageManagerInterface,
): Promise<void> {
  // create root tree
  const fsHooks = new FsHooks(PATHS.ROOT, initialTree);
  createTree(fsHooks);

  const useCore = fsHooks.useHooks(coreHooks);

  // write to config file
  useCore((root) => root['config.json']).write(
    JSON.stringify({ command, packageManager }),
  );

  // create scripts
  const binDir = useCore((root) => root.bin);
  const { bash, powershell } = getScriptNames(command);
  binDir.fileCreate(bash, bashScript(packageManager));
  if (IS_WINDOWS) {
    binDir.fileCreate(powershell, powershellScript(packageManager));
  }

  // install package (link in development)
  const npmCommand = IS_DEV ? npmCommands.link : npmCommands.install;
  const useNpm = fsHooks.useHooks(npmHooks);
  await useNpm(({ lib }) => lib)[npmCommand]([PACKAGE_NAME]);
}
