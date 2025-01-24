import type { PackageManagerInterface } from './package-manager.types.js';

export interface ConfigInterface {
  /**
   * Executable script name
   */
  command: string;
  /**
   * default package manager
   */
  packageManager: PackageManagerInterface;
}
