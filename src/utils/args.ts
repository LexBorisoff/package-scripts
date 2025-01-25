import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getConfigData } from '../config/get-config-data.js';

const desc = {
  runWith(packageManager: string): string {
    return `Run a script using ${packageManager}`;
  },
};

const group = {
  script: 'Script Options:',
  packageManager: 'Package Manager Options:',
};

const options = [
  'npm',
  'pnpm',
  'yarn',
  'bun',
  'select',
  'first',
  'default',
  'which',
] as const;

type Option = (typeof options)[number];

function noConflict(itself: Option, ...other: Option[]): Option[] {
  return options.filter(
    (option) => option !== itself && !other.includes(option),
  );
}

const parsed = yargs(hideBin(process.argv))
  .scriptName(getConfigData().command)
  .usage(`Usage: $0 [OPTION]... [ARG]...`)
  .usage(`Interactively select and run scripts using any package manager`)
  .option('npm', {
    type: 'boolean',
    description: desc.runWith('npm'),
    alias: 'n',
    group: group.script,
    conflicts: noConflict('npm', 'select'),
  })
  .option('pnpm', {
    type: 'boolean',
    description: desc.runWith('pnpm'),
    alias: 'p',
    group: group.script,
    conflicts: noConflict('pnpm', 'select'),
  })
  .option('yarn', {
    type: 'boolean',
    description: desc.runWith('yarn'),
    group: group.script,
    alias: 'y',
    conflicts: noConflict('yarn', 'select'),
  })
  .option('bun', {
    type: 'boolean',
    description: desc.runWith('bun'),
    group: group.script,
    alias: 'b',
    conflicts: noConflict('bun', 'select'),
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
    conflicts: noConflict('default'),
  })
  .option('which', {
    type: 'boolean',
    description: 'Show which package which is currently used',
    alias: 'w',
    group: group.packageManager,
    conflicts: noConflict('which'),
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
