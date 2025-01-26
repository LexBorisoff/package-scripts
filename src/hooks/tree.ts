import { CONFIG_FILE, PACKAGE_NAME } from '../constants.js';

import type { TreeInterface } from 'fs-hooks';

export const initialTree = {
  bin: {},
  lib: {},
  tmp: {
    script: '',
    arguments: '',
    'package-manager': '',
  },
} satisfies TreeInterface;

export const tree = {
  ...initialTree,
  [CONFIG_FILE]: '',
  lib: {
    node_modules: {
      [PACKAGE_NAME]: {
        dist: {},
      },
    },
  },
} satisfies TreeInterface;
