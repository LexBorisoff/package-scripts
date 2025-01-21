import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export const args = yargs(hideBin(process.argv))
  .usage('scripts [<filter args> [--verbose | -v]]')
  .usage('scripts [--verbose | -v]')
  .usage('scripts <OPTION>')
  .option('use', {
    type: 'string',
    description: 'Set a default package manager',
  })
  .option('remove', {
    type: 'string',
    description: 'Remove a package manager from the list',
  })
  .option('ignore', {
    type: 'boolean',
    description: 'Ignore "packageManager" property in package.json',
  })
  .option('verbose', {
    type: 'boolean',
    alias: 'v',
    hidden: true,
  })
  .help()
  .version()
  .parseSync();
