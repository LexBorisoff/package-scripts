import fs from 'node:fs';
import path from 'node:path';

import { FsHooks } from 'fs-hooks';

import { IS_WINDOWS } from '../constants.js';
import { useCoreHooks } from '../hooks/core.hooks.js';
import { permissionsHooks } from '../hooks/permissions.hooks.js';

import { paths } from './paths.js';
import { bashScript, powershellScript } from './script-contents.js';
import { tree } from './tree.js';

export async function createScriptFiles(command: string): Promise<void> {
  const binDir = useCoreHooks((root) => root.bin);
  const scriptNames = { bash: command, powershell: `${command}.ps1` };
  const { bash, powershell } = scriptNames;

  // delete files that are not named based on the command
  const binFiles = fs.readdirSync(binDir.getPath());
  binFiles
    .filter((file) => {
      const filePath = path.resolve(binDir.getPath(), file);
      const isCommandFile = Object.values(scriptNames).includes(file);
      return fs.statSync(filePath).isFile() && !isCommandFile;
    })
    .forEach((file) => {
      binDir.fileDelete(file);
    });

  const fsHooks = new FsHooks(paths.root, tree);
  const usePermissions = fsHooks.useHooks(permissionsHooks);
  const binPermissions = usePermissions(({ bin }) => bin);

  // create scripts files
  binDir.fileCreate(bash, bashScript);
  await binPermissions.x(bash);

  if (IS_WINDOWS) {
    binDir.fileCreate(powershell, powershellScript);
    await binPermissions.x(powershell);
  }
}
