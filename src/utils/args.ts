import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getConfigData } from '../config/get-config-data.js';

const group = {
  packageManager: 'Override Default Package Manager:',
  config: 'Config Options:',
  other: 'Other Options:',
};

const parsed = yargs(hideBin(process.argv))
  .scriptName(getConfigData().command)
  .usage(`Usage: $0 [OPTION]... [ARG]...`)
  .usage(`Interactively select and run package scripts`)
  .option('npm', {
    type: 'boolean',
    description: 'Use npm for current script run',
    alias: 'n',
    group: group.packageManager,
    conflicts: ['pnpm', 'yarn', 'bun', 'default', 'which'],
  })
  .option('pnpm', {
    type: 'boolean',
    description: 'Use pnpm for current script run',
    alias: 'p',
    group: group.packageManager,
    conflicts: ['npm', 'yarn', 'bun', 'default', 'which'],
  })
  .option('yarn', {
    type: 'boolean',
    description: 'Use yarn for current script run',
    group: group.packageManager,
    alias: 'y',
    conflicts: ['npm', 'pnpm', 'bun', 'default', 'which'],
  })
  .option('bun', {
    type: 'boolean',
    description: 'Use bun for current script run',
    group: group.packageManager,
    alias: 'b',
    conflicts: ['npm', 'pnpm', 'yarn', 'default', 'which'],
  })
  .option('default', {
    type: 'string',
    description: 'Set the default package manager',
    alias: 'd',
    group: group.config,
    conflicts: ['select', 'npm', 'pnpm', 'yarn', 'bun', 'which'],
  })
  .option('select', {
    type: 'boolean',
    description: 'Prompt selection even if a script is matched',
    alias: 's',
    group: group.other,
    conflicts: ['default', 'which'],
  })
  .option('which', {
    type: 'boolean',
    description: 'Show which package which is currently used',
    alias: 'w',
    group: group.other,
    conflicts: ['select', 'npm', 'pnpm', 'yarn', 'bun', 'default'],
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
