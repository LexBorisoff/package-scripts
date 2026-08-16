import fs from 'node:fs';
import path from 'node:path';

import { FileTree } from '@lexjs/filetree';

import { IS_WINDOWS, BASH_START_FILE } from '../constants.js';
import { useCoreActions } from '../filetree/core-actions.js';
import { permissionActions } from '../filetree/permission-actions.js';

import { paths } from './paths.js';
import {
  bashScript,
  bashStartScript,
  powershellScript,
} from './script-contents.js';
import { tree } from './tree.js';

export async function createScriptFiles(command: string): Promise<void> {
  const rootDir = useCoreActions((root) => root);
  const binDir = useCoreActions((root) => root.bin);
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

  const fileTree = new FileTree(paths.root, tree);
  const usePermissions = fileTree.use(permissionActions);
  const binPermissions = usePermissions(({ bin }) => bin);

  // create scripts files
  rootDir.fileCreate(BASH_START_FILE, bashStartScript);
  binDir.fileCreate(bash, bashScript);
  await binPermissions.x(bash);

  if (IS_WINDOWS) {
    binDir.fileCreate(powershell, powershellScript);
    await binPermissions.x(powershell);
  }
}
