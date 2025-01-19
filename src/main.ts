#!/usr/bin/env node

import { useCoreHooks } from './hooks/use-core-hooks.js';
import { handlePackageManager } from './package-manager/handle-package-manager.js';
import { selectScript } from './select-script.js';
import { args } from './utils/args.js';
import { logger } from './utils/logger.js';

const { use } = args;

(async function main() {
  if (use != null) {
    await handlePackageManager(use);
    return;
  }

  try {
    const script = await selectScript();

    if (script != null) {
      useCoreHooks(({ tmp }) => tmp.script).write(script);
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
  }
})();
