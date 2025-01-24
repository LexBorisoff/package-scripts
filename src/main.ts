#!/usr/bin/env node

import {
  currentPackageManager,
  defaultPackageManager,
} from './package-manager/index.js';
import { selectScript } from './select-script.js';
import { args } from './utils/args.js';
import { logger } from './utils/logger.js';
import { updateTmp } from './utils/update-tmp.js';

const { _, use, manager } = args;

(async function main() {
  try {
    if (use != null && _.length === 0) {
      await defaultPackageManager(use);
      return;
    }

    if (manager) {
      currentPackageManager();
      return;
    }

    const script = await selectScript();

    if (script != null) {
      updateTmp.script(script);
      updateTmp.scriptArguments();
      updateTmp.packageManager();
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
  }
})();
