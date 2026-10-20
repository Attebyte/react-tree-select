import path from 'path';
import type { Plugin } from '@docusaurus/types';

// The site renders the built library (../dist) and the shared examples (../examples) the way a consumer would.
const root = path.resolve(process.cwd(), '..');
const site = process.cwd();

export default function libraryPlugin(): Plugin {
  return {
    name: 'react-tree-select-library',
    configureWebpack() {
      return {
        resolve: {
          alias: {
            '@attebyte/react-tree-select/style.css': path.join(root, 'dist/style.css'),
            '@attebyte/react-tree-select$': path.join(root, 'dist/main.js'),
            // The library and examples live outside the site, so make every import share the site's React
            react: path.join(site, 'node_modules/react'),
            'react-dom': path.join(site, 'node_modules/react-dom')
          }
        }
      };
    },
    configurePostCss(options) {
      // Tailwind for the examples' own classes
      options.plugins.push('@tailwindcss/postcss');
      return options;
    }
  };
}
