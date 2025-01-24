#!/usr/bin/env node

import $_ from '@lexjs/prompts';
import 'dotenv/config';

import { updateConfig } from '../config/update-config.js';
import { CONFIG_FILE, INITIAL_COMMAND } from '../constants.js';
import { useCoreHooks } from '../hooks/use-core-hooks.js';
import {
  selectPackageManager,
  SelectPmReason,
} from '../package-manager/select-package-manager.js';
import { colors, logger } from '../utils/logger.js';
import { parseData } from '../utils/parse-data.js';

import { createScriptFiles } from './create-script-files.js';
import { initializeApp } from './initialize-app.js';
import { linkDist } from './link-dist.js';

import type { ConfigInterface } from '../types/config.types.js';

function isEmpty(str: string | undefined): str is undefined | '' {
  return str == null || str === '';
}

(async function createApp(): Promise<void> {
  let command: string | undefined;
  let packageManager: string | undefined;

  // get current config data if exists
  const rootDir = useCoreHooks((root) => root);
  const configExists = rootDir.exists(CONFIG_FILE);

  if (configExists) {
    logger.info('Found local config');

    const configData = rootDir.fileRead(CONFIG_FILE);

    if (configData != null) {
      const config = parseData<ConfigInterface>(configData);
      command = config?.command;
      packageManager = config?.packageManager;
    }

    if (!isEmpty(command)) {
      logger.log(
        `  ${colors.green('✔')} command name: ${colors.yellow(command)}`,
      );
    } else {
      logger.error(`  ! no command name`);
    }

    if (!isEmpty(packageManager)) {
      logger.log(
        `  ${colors.green('✔')} package manager: ${colors.yellow(
          packageManager,
        )}`,
      );
    } else {
      logger.error(`  ! no package manager`);
    }

    logger.log('');
  }

  if (isEmpty(command)) {
    const result = await $_.text({
      name: 'command',
      message: 'What should be the command name?',
      initial: INITIAL_COMMAND,
    });

    if (result.command == null) {
      return;
    }

    command = result.command;
  }

  if (isEmpty(packageManager)) {
    packageManager = await selectPackageManager(SelectPmReason.InitializeApp);

    if (packageManager == null) {
      return;
    }
  }

  if (packageManager != null) {
    logger.info('Initializing ...');

    await initializeApp();
    linkDist();
    createScriptFiles(command);
    updateConfig({ command, packageManager });
  }
})();
