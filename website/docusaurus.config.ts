import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import { themes as prismThemes } from 'prism-react-renderer';

const siteUrl = 'https://rts.attebyte.io';
const description = 'An accessible React tree select and checkbox tree component with tri-state (indeterminate) selection, keyboard navigation, TypeScript generics, and fully replaceable parts.';

// Structured data so search engines can identify the project as a software library
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: 'React Tree Select',
  alternateName: '@attebyte/react-tree-select',
  description,
  url: siteUrl,
  codeRepository: 'https://github.com/Attebyte/react-tree-select',
  programmingLanguage: ['TypeScript', 'JavaScript'],
  runtimePlatform: 'React',
  license: 'https://opensource.org/licenses/MIT',
  keywords: 'react tree select, react checkbox tree, react tree view, tree select component, indeterminate checkbox, accessible tree',
  author: { '@type': 'Organization', name: 'Attebyte LLC', url: 'https://attebyte.io' }
};

const config: Config = {
  title: 'React Tree Select',
  tagline: 'An accessible, customizable tree select and checkbox tree for React',
  // Icons are declared in headTags: the ICO is marked 32x32 so browsers that support SVG prefer the SVG

  url: siteUrl,
  baseUrl: '/',
  trailingSlash: false,

  organizationName: 'Attebyte',
  projectName: 'react-tree-select',

  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw'
    }
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },

  headTags: [
    { tagName: 'link', attributes: { rel: 'icon', href: '/favicon.ico', sizes: '32x32' } },
    { tagName: 'link', attributes: { rel: 'icon', href: '/img/favicon.svg', type: 'image/svg+xml' } },
    { tagName: 'link', attributes: { rel: 'apple-touch-icon', href: '/img/apple-touch-icon.png' } },
    { tagName: 'link', attributes: { rel: 'manifest', href: '/site.webmanifest' } },
    { tagName: 'meta', attributes: { name: 'theme-color', content: '#4f46e5' } },
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify(structuredData)
    }
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/Attebyte/react-tree-select/edit/main/website/',
          showLastUpdateTime: false
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css'
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          filename: 'sitemap.xml'
        }
      } satisfies Preset.Options
    ]
  ],

  plugins: ['./plugins/library.ts'],

  themeConfig: {
    image: 'img/social-card.png',
    metadata: [
      { name: 'description', content: description },
      { name: 'keywords', content: structuredData.keywords },
      { name: 'twitter:card', content: 'summary_large_image' }
    ],
    colorMode: {
      respectPrefersColorScheme: true
    },
    navbar: {
      title: 'React Tree Select',
      logo: {
        alt: 'React Tree Select logo',
        src: 'img/logo.svg'
      },
      items: [
        { type: 'docSidebar', sidebarId: 'docs', position: 'left', label: 'Docs' },
        { to: '/docs/api', label: 'API', position: 'left' },
        { to: '/docs/examples', label: 'Examples', position: 'left' },
        { href: 'pathname:///storybook/index.html', label: 'Storybook', position: 'left' },
        { href: 'https://www.npmjs.com/package/@attebyte/react-tree-select', label: 'npm', position: 'right' },
        { href: 'https://github.com/Attebyte/react-tree-select', label: 'GitHub', position: 'right' }
      ]
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Getting started', to: '/docs/getting-started' },
            { label: 'API reference', to: '/docs/api' },
            { label: 'Accessibility', to: '/docs/accessibility' },
            { label: 'Upgrading from 1.x', to: '/docs/migration' }
          ]
        },
        {
          title: 'Examples',
          items: [
            { label: 'All examples', to: '/docs/examples' },
            { label: 'File tree', to: '/docs/examples/file-tree' },
            { label: 'Large tree', to: '/docs/examples/large-tree' },
            { label: 'Storybook', href: 'pathname:///storybook/index.html' }
          ]
        },
        {
          title: 'Project',
          items: [
            { label: 'GitHub', href: 'https://github.com/Attebyte/react-tree-select' },
            { label: 'npm', href: 'https://www.npmjs.com/package/@attebyte/react-tree-select' },
            { label: 'Buy me a coffee', href: 'https://www.buymeacoffee.com/tristan10' }
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Attebyte LLC. Released under the MIT License.`
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula
    }
  } satisfies Preset.ThemeConfig
};

export default config;
