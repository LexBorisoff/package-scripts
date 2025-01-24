import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getConfigData } from '../config/get-config-data.js';

const group = {
  script: 'Script Options:',
  packageManager: 'Package Manager Options:',
};

const desc = {
  runWith(packageManager: string): string {
    return `Run a script using ${packageManager}`;
  },
};

const parsed = yargs(hideBin(process.argv))
  .scriptName(getConfigData().command)
  .usage(`Usage: $0 [OPTION]... [ARG]...`)
  .usage(`Interactively select and run scripts using any package manager`)
  .option('npm', {
    type: 'boolean',
    description: desc.runWith('npm'),
    alias: 'n',
    group: group.script,
    conflicts: ['pnpm', 'yarn', 'bun', 'default', 'which'],
  })
  .option('pnpm', {
    type: 'boolean',
    description: desc.runWith('pnpm'),
    alias: 'p',
    group: group.script,
    conflicts: ['npm', 'yarn', 'bun', 'default', 'which'],
  })
  .option('yarn', {
    type: 'boolean',
    description: desc.runWith('yarn'),
    group: group.script,
    alias: 'y',
    conflicts: ['npm', 'pnpm', 'bun', 'default', 'which'],
  })
  .option('bun', {
    type: 'boolean',
    description: desc.runWith('bun'),
    group: group.script,
    alias: 'b',
    conflicts: ['npm', 'pnpm', 'yarn', 'default', 'which'],
  })
  .option('select', {
    type: 'boolean',
    description: 'Prompt selection if a single script is matched',
    alias: 's',
    group: group.script,
    conflicts: ['first', 'default', 'which'],
  })
  .option('first', {
    type: 'boolean',
    description: 'Pick the first matched script without prompt',
    alias: 'f',
    group: group.script,
    conflicts: ['select', 'default', 'which'],
  })
  .option('default', {
    type: 'string',
    description: 'Set the default package manager',
    alias: 'd',
    group: group.packageManager,
    conflicts: ['select', 'first', 'npm', 'pnpm', 'yarn', 'bun', 'which'],
  })
  .option('which', {
    type: 'boolean',
    description: 'Show which package which is currently used',
    alias: 'w',
    group: group.packageManager,
    conflicts: ['select', 'first', 'npm', 'pnpm', 'yarn', 'bun', 'default'],
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
