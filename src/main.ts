#!/usr/bin/env node

import { renameCommand } from './create-app/rename-command.js';
import {
  currentPackageManager,
  defaultPackageManager,
} from './package-manager/index.js';
import { selectScript } from './select-script.js';
import { updateTmp } from './update-tmp.js';
import { args } from './utils/args.js';
import { logger } from './utils/logger.js';

(async function main() {
  try {
    if (args.which) {
      currentPackageManager();
      return;
    }

    if (args.default != null) {
      await defaultPackageManager(args.default);
      return;
    }

    if (args.rename != null) {
      await renameCommand(args.rename);
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
