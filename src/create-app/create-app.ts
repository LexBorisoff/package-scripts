import $_ from '@lexjs/prompts';

import { createLinks } from './create-links.js';
import { initializeApp } from './initialize-app.js';

async function createApp(): Promise<void> {
  const { cmdName } = await $_.text({
    name: 'cmdName',
    message: 'What should be the command name?',
    initial: 'scripts',
  });

  if (cmdName != null) {
    await initializeApp(cmdName);
    createLinks();
  }
}

createApp();
