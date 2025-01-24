import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getConfigData } from '../config/get-config-data.js';

const parsed = yargs(hideBin(process.argv))
  .scriptName(getConfigData().command)
  .usage(`Usage: $0 [OPTION]... [ARG]...`)
  .usage(`Interactively select and run package scripts`)
  .option('select', {
    type: 'boolean',
    description: 'Prompt selection even if a script is matched',
    alias: 's',
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
  .parserConfiguration({
    'populate--': true,
  })
  .parseSync();

export const args = parsed as typeof parsed & { '--'?: (string | number)[] };
