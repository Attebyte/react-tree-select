import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    'intro',
    'getting-started',
    'controlled',
    'selection',
    'customization',
    'accessibility',
    'api',
    {
      type: 'category',
      label: 'Examples',
      link: { type: 'doc', id: 'examples/index' },
      items: [
        'examples/disabled-nodes',
        'examples/styling',
        'examples/custom-icon',
        'examples/file-tree',
        'examples/comment-thread',
        'examples/large-tree'
      ]
    },
    'faq',
    'migration'
  ]
};

export default sidebars;
