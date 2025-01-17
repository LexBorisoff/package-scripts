import fs from 'node:fs';
import path from 'node:path';

import { FsHooks } from 'fs-hooks';
import { coreHooks } from 'fs-hooks/core';

import { isWindows, packageName, rootPath } from '../constants.js';

function link(
  target: string,
  linkProps: { parentPath: string; linkName: string },
): void {
  const { parentPath, linkName } = linkProps;
  const linkPath = path.resolve(parentPath, linkName);

  if (fs.existsSync(linkPath)) {
    fs.rmSync(linkPath, { force: true, recursive: true });
  }
  fs.symlinkSync(target, linkPath, isWindows ? 'junction' : 'dir');
}

export function createLinks(): void {
  const fsHooks = new FsHooks(rootPath, {
    bin: {},
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

  const tmpPath = useCore(({ tmp }) => tmp).getPath();
  const distPath = useCore(
    ({ lib }) => lib.node_modules[packageName].dist,
  ).getPath();

  link(distPath, { parentPath: rootPath, linkName: '.dist' });

  if (isWindows) {
    const binPath = useCore(({ bin }) => bin).getPath();
    link(distPath, { parentPath: binPath, linkName: '.dist' });
    link(tmpPath, { parentPath: binPath, linkName: '.tmp' });
  }
}
