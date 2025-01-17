import $_ from '@lexjs/prompts';

import { createLinks } from './create-links.js';
import { initializeApp } from './initialize-app.js';

async function createApp(): Promise<void> {
  const { command } = await $_.text({
    name: 'command',
    message: 'What should be the command name?',
    initial: 'scripts',
  });

  if (command != null) {
    await initializeApp(command);
    createLinks();
  }
}

createApp();
