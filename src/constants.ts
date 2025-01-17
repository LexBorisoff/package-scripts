import os from 'node:os';
import path from 'node:path';

export const rootPath = path.resolve(os.homedir(), '.package-scripts');
export const isWindows = os.platform() === 'win32';
export const packageName = 'package-scripts';
