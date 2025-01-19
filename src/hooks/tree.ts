import { PACKAGE_NAME } from '../constants.js';

import type { TreeInterface } from 'fs-hooks';

export const initialTree = {
  bin: {},
  lib: {},
  tmp: {
    script: '',
  },
  'config.json': '',
} satisfies TreeInterface;

export const tree = {
  ...initialTree,
  lib: {
    node_modules: {
      [PACKAGE_NAME]: {
        dist: {},
      },
    },
  },
} satisfies TreeInterface;
