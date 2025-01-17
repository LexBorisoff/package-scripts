import fs from 'node:fs';
import path from 'node:path';

import { FsHooks } from 'fs-hooks';
import { coreHooks } from 'fs-hooks/core';

import { isWindows, packageName, rootPath } from '../constants.js';

export function createLinks(): void {
  const fsHooks = new FsHooks(rootPath, {
    bin: {},
    bash: {},
    tmp: {},
    lib: {
      node_modules: {
        [packageName]: {
          dist: {},
        },
      },
    },
  });

  const useCore = fsHooks.useHooks(coreHooks);

  const bashPath = useCore(({ bash }) => bash).getPath();
  const tmpPath = useCore(({ tmp }) => tmp).getPath();
  const libPath = useCore(
    ({ lib }) => lib.node_modules[packageName].dist,
  ).getPath();

  function createLink(parentDir: string): void {
    const libLink = path.resolve(parentDir, '.lib');
    const tmpLink = path.resolve(parentDir, '.tmp');

    // lib link
    if (fs.existsSync(libLink)) {
      fs.rmSync(libLink, { force: true, recursive: true });
    }
    fs.symlinkSync(libPath, libLink, isWindows ? 'junction' : 'dir');

    // tmp link
    if (fs.existsSync(tmpLink)) {
      fs.rmSync(tmpLink, { force: true, recursive: true });
    }
    fs.symlinkSync(tmpPath, tmpLink, isWindows ? 'junction' : 'dir');
  }

  createLink(bashPath);

  if (isWindows) {
    createLink(useCore(({ bin }) => bin).getPath());
  }
}
