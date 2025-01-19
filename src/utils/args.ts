import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export const args = yargs(hideBin(process.argv))
  .option('package-manager', {
    type: 'string',
    description: 'Package manager to run scripts',
  })
  .help()
  .parseSync();
