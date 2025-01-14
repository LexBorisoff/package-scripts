import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export const args = yargs(hideBin(process.argv)).help().parseSync();
