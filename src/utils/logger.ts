/* eslint-disable no-console */
import chalk from 'chalk';

export const logger = {
  success(message: string) {
    console.log(chalk.green(message));
  },
  warn(message: string) {
    console.log(chalk.yellow(message));
  },
  error(message: string) {
    console.log(chalk.red(message));
  },
};
