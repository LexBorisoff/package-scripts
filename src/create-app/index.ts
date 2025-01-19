#!/usr/bin/env node

import $_ from '@lexjs/prompts';
import 'dotenv/config';

import { updateConfig } from '../config/update-config.js';
import { INITIAL_COMMAND } from '../constants.js';
import {
  selectPackageManager,
  SelectPmReason,
} from '../package-manager/select-package-manager.js';
import { updatePackageManager } from '../package-manager/update-package-manager.js';

import { createScriptFiles } from './create-script-files.js';
import { initializeApp } from './initialize-app.js';
import { linkDist } from './link-dist.js';

(async function createApp(): Promise<void> {
  const { command } = await $_.text({
    name: 'command',
    message: 'What should be the command name?',
    initial: INITIAL_COMMAND,
  });

  if (command != null) {
    const packageManager = await selectPackageManager(
      SelectPmReason.InitializeApp,
    );

    if (packageManager != null) {
      const { usePackageManager } = await $_.toggle({
        name: 'usePackageManager',
        message:
          'Use "packageManager" property from package.json when available?',
        initial: true,
      });

      if (usePackageManager != null) {
        await initializeApp();
        linkDist();
        createScriptFiles(command);

        updateConfig({ command, packageManager, usePackageManager });
        updatePackageManager(packageManager);
      }
    }
  }
})();
