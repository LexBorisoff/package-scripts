import $_ from '@lexjs/prompts';

import { getConfigData } from '../config/get-config-data.js';
import { updateConfig } from '../config/update-config.js';

export async function ignorePackageManager(): Promise<void> {
  const { ignorePackageManagerProp } = getConfigData();

  const { ignore } = await $_.toggle({
    name: 'ignore',
    message: 'Ignore "packageManager" property in package.json?',
    initial: ignorePackageManagerProp,
  });

  if (ignore != null && ignore !== ignorePackageManagerProp) {
    updateConfig({
      ignorePackageManagerProp: ignore,
    });
  }
}
