import fs from 'node:fs';
import path from 'node:path';

import { PackageJsonError } from '../errors/package-json.error.js';

import type { PackageJson } from 'type-fest';

export function getPackageJson(): PackageJson {
  const packageJson = path.resolve(process.cwd(), 'package.json');

  if (!fs.existsSync(packageJson)) {
    throw new PackageJsonError(
      'package.json does not exist in current directory',
    );
  }

  try {
    const json = fs.readFileSync(packageJson, 'utf-8');
    return JSON.parse(json);
  } catch {
    return {};
  }
}
