import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getConfigData } from '../config/get-config-data.js';

export const args = yargs(hideBin(process.argv))
  .scriptName(getConfigData().command)
  .usage(`Usage: $0 [OPTION]... [ARG]...`)
  .usage(`Interactively select and run a package script`)
  .option('select', {
    alias: 's',
    type: 'boolean',
    description: 'Select a script even if exactly matched',
  })
  .option('use', {
    type: 'string',
    description: 'Set a package manager (default / current run)',
    alias: 'u',
  })
  .option('manager', {
    type: 'boolean',
    description: 'Show which package manager is currently used',
    alias: 'm',
  })
  .help()
  .version()
  .hide('help')
  .hide('version')
  .parseSync();
