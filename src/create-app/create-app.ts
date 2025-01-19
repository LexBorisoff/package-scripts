#!/usr/bin/env node

import $_ from '@lexjs/prompts';
import 'dotenv/config';

import {
  selectPackageManager,
  SelectPmReason,
} from '../package-manager/select-package-manager.js';

import { initializeApp } from './initialize-app.js';
import { linkDist } from './link-dist.js';

(async function createApp(): Promise<void> {
  const { command } = await $_.text({
    name: 'command',
    message: 'What should be the command name?',
    initial: 'scripts',
  });

  if (command != null) {
    const packageManager = await selectPackageManager(
      SelectPmReason.InitializeApp,
    );

    if (packageManager != null) {
      await initializeApp(command, packageManager);
      linkDist();
    }
  }
})();
