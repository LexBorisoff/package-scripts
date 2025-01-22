import os from 'node:os';
import path from 'node:path';

import { getProjectInfo } from './utils/get-project-info.js';

const NODE_ENV = process.env.NODE_ENV;

export const IS_DEV = NODE_ENV === 'development' || NODE_ENV === 'dev';
export const IS_WINDOWS = os.platform() === 'win32';

export const PACKAGE_NAME = getProjectInfo().name!;
export const PACKAGE_VERSION = getProjectInfo().version!;

export const INITIAL_COMMAND = 'scripts';
export const CONFIG_FILE = 'config.json';

class Paths {
  get ROOT(): string {
    return path.resolve(os.homedir(), `.${PACKAGE_NAME}`);
  }

  get BIN_DIR(): string {
    return path.resolve(this.ROOT, 'bin');
  }

  get LIB_DIR(): string {
    return path.resolve(this.ROOT, 'lib');
  }

  get TMP_DIR(): string {
    return path.resolve(this.ROOT, 'tmp');
  }

  get DIST_LINK_NAME(): string {
    return '.dist';
  }

  get DIST_LINK(): string {
    return path.resolve(this.ROOT, this.DIST_LINK_NAME);
  }

  get MAIN_FILE(): string {
    return path.resolve(this.DIST_LINK, 'main.js');
  }

  get SCRIPT_FILE(): string {
    return path.resolve(this.TMP_DIR, 'script');
  }

  get PACKAGE_MANAGER_FILE(): string {
    return path.resolve(this.TMP_DIR, 'package-manager');
  }
}

export const PATHS = new Paths();
