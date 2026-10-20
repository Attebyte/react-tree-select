// Publishes the Storybook build (../storybook-static) under the docs site at /storybook/
import { cpSync, existsSync } from 'fs';
import { resolve } from 'path';

const source = resolve(process.cwd(), '../storybook-static');
const target = resolve(process.cwd(), 'build/storybook');

if (!existsSync(source)) {
  console.warn('Storybook build not found; run `npm run build-storybook` in the repository root to include it at /storybook/.');
  process.exit(0);
}

cpSync(source, target, { recursive: true });
console.log(`Copied Storybook to ${target}`);
