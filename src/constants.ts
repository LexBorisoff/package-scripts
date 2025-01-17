import os from 'node:os';
import path from 'node:path';

import type { PmInterface } from './types/pm.types.js';

export const rootPath = path.resolve(os.homedir(), '.package-scripts');
export const isWindows = os.platform() === 'win32';
export const packageName = 'package-scripts';

export const defaultPm: PmInterface = {
  pm: 'npm',
  run: 'run',
};
