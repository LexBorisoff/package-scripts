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
  /**
   * Ignore `packageManager` property in package.json
   */
  ignorePackageManagerProp: boolean;
}
