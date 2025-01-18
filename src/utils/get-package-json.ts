import fs from 'node:fs';

import { findUpSync } from 'find-up';

import { parseData } from './parse-data.js';

import type { PackageJson } from 'type-fest';

export function getPackageJson(): PackageJson {
  try {
    const packageJsonPath = findUpSync('package.json');
    if (packageJsonPath == null) {
      return {};
    }

    const json = fs.readFileSync(packageJsonPath, 'utf-8');

    return parseData<PackageJson>(json) ?? {};
  } catch {
    return {};
  }
}
