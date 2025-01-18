import fs from 'node:fs';

import { FsHooks } from 'fs-hooks';
import { coreHooks } from 'fs-hooks/core';

import { IS_WINDOWS, PACKAGE_NAME, PATHS } from '../constants.js';

export function linkDist(): void {
  const fsHooks = new FsHooks(PATHS.ROOT, {
    lib: {
      node_modules: {
        [PACKAGE_NAME]: {
          dist: {},
        },
      },
    },
  });

  const useCore = fsHooks.useHooks(coreHooks);

  const distPath = useCore(
    ({ lib }) => lib.node_modules[PACKAGE_NAME].dist,
  ).getPath();

  if (fs.existsSync(PATHS.DIST_LINK)) {
    fs.rmSync(PATHS.DIST_LINK, { force: true, recursive: true });
  }
  fs.symlinkSync(distPath, PATHS.DIST_LINK, IS_WINDOWS ? 'junction' : 'dir');
}
