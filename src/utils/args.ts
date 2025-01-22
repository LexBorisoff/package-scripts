import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getConfigData } from '../config/get-config-data.js';

const group = {
  scripts: `Script Options`,
  packageManager: `Package Manager Options`,
  config: `Config Options`,
};

export const args = yargs(hideBin(process.argv))
  .scriptName(getConfigData().command)
  .usage(`Usage: $0 [OPTION]... [ARG]...`)
  .usage(`Interactively select and run a package script`)
  .option('i', {
    type: 'boolean',
    description: 'Trigger interactive mode',
    group: group.scripts,
  })
  .option('use', {
    type: 'string',
    description: 'Set the default package manager',
    alias: 'u',
    group: group.packageManager,
  })
  .option('manager', {
    type: 'boolean',
    description: 'Display package manager in current project',
    alias: 'm',
    group: group.packageManager,
  })
  .option('config', {
    type: 'boolean',
    description: 'Change CLI configuration',
    alias: 'c',
    group: group.config,
  })
  .help()
  .version()
  .hide('help')
  .hide('version')
  .parseSync();
