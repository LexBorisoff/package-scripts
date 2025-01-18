#!/usr/bin/env node

import $_ from '@lexjs/prompts';
import 'dotenv/config';

import { initializeApp } from './initialize-app.js';
import { linkDist } from './link-dist.js';

(async function createApp(): Promise<void> {
  const { command } = await $_.text({
    name: 'command',
    message: 'What should be the command name?',
    initial: 'scripts',
  });

  if (command != null) {
    await initializeApp(command);
    linkDist();
  }
})();
