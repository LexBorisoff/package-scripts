#!/usr/bin/env node

import $_ from '@lexjs/prompts';
import chalk from 'chalk';
import 'dotenv/config';

import { updateConfig } from '../config/update-config.js';
import { CONFIG_FILE, INITIAL_COMMAND, PACKAGE_NAME } from '../constants.js';
import { useCoreHooks } from '../hooks/use-core-hooks.js';
import {
  selectPackageManager,
  SelectPmReason,
} from '../package-manager/select-package-manager.js';
import { logger } from '../utils/logger.js';
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
    const configData = rootDir.fileRead(CONFIG_FILE);

    if (configData != null) {
      const config = parseData<ConfigInterface>(configData);
      command = config?.command;
      packageManager = config?.packageManager;
    }
  }

  let overrideCommand = false;
  if (!isEmpty(command)) {
    logger.warn(
      `${PACKAGE_NAME} command is set as ${chalk.underline(command)}\n`,
    );

    const { override } = await $_.toggle({
      message: 'Do you want to rename it?',
      name: 'override',
    });

    if (override == null) {
      return;
    }

    overrideCommand = override;
  }

  if (isEmpty(command) || overrideCommand) {
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
    await initializeApp();
    linkDist();
    createScriptFiles(command);
    updateConfig({ command, packageManager });
  }
})();
