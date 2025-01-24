#!/usr/bin/env node

import {
  currentPackageManager,
  defaultPackageManager,
} from './package-manager/index.js';
import { selectScript } from './select-script.js';
import { updateTmp } from './update-tmp.js';
import { args } from './utils/args.js';
import { logger } from './utils/logger.js';

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
      updateTmp(script);
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    }
  }
})();
