#!/usr/bin/env node

import { removePackageManager } from './package-manager/remove-package-manager.js';
import { usePackageManager } from './package-manager/use-package-manager.js';
import { selectScript } from './select-script.js';
import { args } from './utils/args.js';
import { logger } from './utils/logger.js';
import { updateTmp } from './utils/update-tmp.js';

const { use, remove } = args;

(async function main() {
  if (use != null) {
    await usePackageManager(use);
    return;
  }

  if (remove != null) {
    await removePackageManager(remove);
    return;
  }

  try {
    const script = await selectScript();

    if (script != null) {
      updateTmp.script(script);
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
  }
})();
