import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export const args = yargs(hideBin(process.argv))
  .option('use', {
    type: 'string',
    description: 'Default package manager to use when running a script',
  })
  .option('verbose', {
    type: 'boolean',
    alias: 'v',
    description: 'Show currently used package manager',
  })
  .option('remove', {
    type: 'string',
    description: 'Remove a package manager from the list',
  })
  .option('ignore', {
    type: 'boolean',
    description: 'Ignore "packageManager" property in package.json',
  })
  .option('exact', {
    type: 'boolean',
    alias: 'e',
    description: 'Select a script if an exact match is found',
  })
  .help()
  .parseSync();
