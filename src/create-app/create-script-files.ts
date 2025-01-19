import fs from 'node:fs';
import path from 'node:path';

import { IS_WINDOWS } from '../constants.js';
import { useCoreHooks } from '../hooks/use-core-hooks.js';

import { getScriptNames } from './get-script-names.js';
import { bashScript, powershellScript } from './script-contents.js';

export function createScriptFiles(command: string): void {
  const binDir = useCoreHooks((root) => root.bin);
  const { bash, powershell } = getScriptNames(command);

  // delete files that are not named based on the command
  const binFiles = fs.readdirSync(binDir.getPath());
  binFiles
    .filter((file) => {
      const filePath = path.resolve(binDir.getPath(), file);
      const isCommandFile = file === bash || file === powershell;
      return fs.statSync(filePath).isFile() && !isCommandFile;
    })
    .forEach((file) => {
      binDir.fileDelete(file);
    });

  // create scripts files
  binDir.fileCreate(bash, bashScript);
  if (IS_WINDOWS) {
    binDir.fileCreate(powershell, powershellScript);
  }
}
