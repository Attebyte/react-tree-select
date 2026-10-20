import type { StorybookConfig } from '@storybook/react-vite';
import type { PluginOption } from 'vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  // favicon.svg matches the docs site's icon
  staticDirs: ['./public'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  // Published under the docs site at /storybook/
  async viteFinal(config) {
    // Type declarations are only needed for the library build
    const isDts = (plugin: PluginOption) => !!plugin && typeof plugin === 'object' && 'name' in plugin && /dts/i.test(plugin.name);
    config.plugins = (config.plugins ?? []).flat(Infinity as 1).filter(plugin => !isDts(plugin));
    return config;
  }
};

export default config;
