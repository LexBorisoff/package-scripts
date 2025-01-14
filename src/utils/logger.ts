/* eslint-disable no-console */
import chalk from 'chalk';

export const logger = {
  error(message: string) {
    console.log(chalk.redBright(message));
  },
};
