#!/usr/bin/env node

import {
  currentPackageManager,
  ignorePackageManager,
  removePackageManager,
  usePackageManager,
} from './package-manager/index.js';
import { selectScript } from './select-script.js';
import { args } from './utils/args.js';
import { logger } from './utils/logger.js';
import { updateTmp } from './utils/update-tmp.js';

const { _, use, verbose, remove, ignore } = args;

(async function main() {
  try {
    if (use != null) {
      await usePackageManager(use);
      return;
    }

    if (verbose && _.length === 0) {
      currentPackageManager();
      return;
    }

    if (remove != null) {
      await removePackageManager(remove);
      return;
    }

    if (ignore != null) {
      await ignorePackageManager();
      return;
    }

    const script = await selectScript();

    if (script != null) {
      updateTmp.script(script);
      updateTmp.packageManager();
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
  }
})();
