#!/usr/bin/env node

import { FsHooks } from 'fs-hooks';
import { coreHooks } from 'fs-hooks/core';

import { PATHS } from './constants.js';
import { tree } from './hooks/tree.js';
import { selectScript } from './select-script.js';
import { logger } from './utils/logger.js';

(async function main() {
  try {
    const script = await selectScript();

    if (script != null) {
      const fsHooks = new FsHooks(PATHS.ROOT, tree);

      const useCore = fsHooks.useHooks(coreHooks);
      useCore(({ tmp }) => tmp.script).write(script);
    }
  } catch (error) {
    // TODO: custom errors
    if (error instanceof Error) {
      logger.error(error.message);
    }
  }
})();
