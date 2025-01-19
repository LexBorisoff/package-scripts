import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export const args = yargs(hideBin(process.argv))
  .option('use', {
    type: 'string',
    description: 'Default package manager to use when running a script',
  })
  .help()
  .parseSync();
