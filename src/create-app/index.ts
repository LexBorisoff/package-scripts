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
import type { PackageManagerInterface } from '../types/package-manager.types.js';

async function initialize(
  command: string,
  packageManager: PackageManagerInterface,
): Promise<void> {
  logger.info('Initializing ...');
  await initializeApp();
  linkDist();
  createScriptFiles(command);
  updateConfig({ command, packageManager });
}

(async function createApp(): Promise<void> {
  let command: string | undefined;
  let packageManager: PackageManagerInterface | undefined;

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

    if (command != null) {
      logger.log(
        `  ${colors.green('✔')} command name: ${colors.yellow(command)}`,
      );
    } else {
      logger.warn(`  ! no command name`);
    }

    if (packageManager?.command != null) {
      logger.log(
        `  ${colors.green('✔')} package manager: ${colors.yellow(
          packageManager.command,
        )}`,
      );
    } else {
      logger.warn(`  ! no package manager`);
    }

    logger.log('');
  }

  if (command == null) {
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

  if (packageManager?.command == null) {
    packageManager = await selectPackageManager(SelectPmReason.InitializeApp);

    if (packageManager == null) {
      return;
    }
  }

  if (packageManager != null) {
    initialize(command, packageManager);
  }
})();
