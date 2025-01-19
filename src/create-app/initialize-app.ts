import { createTree, FsHooks } from 'fs-hooks';

import { IS_DEV, PACKAGE_NAME, PATHS } from '../constants.js';
import { npmCommands, npmHooks } from '../hooks/npm.hooks.js';
import { initialTree } from '../hooks/tree.js';

export async function initializeApp(): Promise<void> {
  const fsHooks = new FsHooks(PATHS.ROOT, initialTree);
  createTree(fsHooks);

  // install package (link in development)
  const npmCommand = IS_DEV ? npmCommands.link : npmCommands.install;
  const useNpm = fsHooks.useHooks(npmHooks);
  await useNpm(({ lib }) => lib)[npmCommand]([PACKAGE_NAME]);
}
