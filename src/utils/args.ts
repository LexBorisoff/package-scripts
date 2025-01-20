import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export const args = yargs(hideBin(process.argv))
  .option('use', {
    type: 'string',
    description: 'Default package manager to use when running a script',
  })
  .option('remove', {
    type: 'string',
    description: 'Remove a package manager from the list',
  })
  .help()
  .parseSync();
