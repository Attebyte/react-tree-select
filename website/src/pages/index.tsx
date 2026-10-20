import { useEffect, type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import Heading from '@theme/Heading';
import LiveExample from '@site/src/components/LiveExample';
import ControlledExample from '@site/../examples/ControlledExample';
import styles from './index.module.css';

// The 1.x site was a single page with hash sections; send old links to their new pages
const legacyHashes: Record<string, string> = {
  '#installation': '/docs/getting-started',
  '#getting-started': '/docs/getting-started',
  '#gettingstarted': '/docs/getting-started',
  '#api': '/docs/api',
  '#examples': '/docs/examples'
};

const features = [
  {
    title: 'Tri-state selection',
    description: 'Checking a parent checks its children, and parents show checked, unchecked or indeterminate based on what is selected beneath them. Turn it off for independent selection.'
  },
  {
    title: 'Accessible by default',
    description: 'Follows the WAI-ARIA tree view pattern: a single tab stop, arrow key navigation, Space to select, and screen reader support for expanded and mixed states.'
  },
  {
    title: 'Works with your data',
    description: 'Pass your own tree-shaped objects and tell TreeSelect which properties hold the ID, label, children and checked state. Fully typed with TypeScript generics.'
  },
  {
    title: 'Customize every part',
    description: 'Style it with class names (merged with tailwind-merge), or replace the node, label, checkbox or expand icon with your own React components.'
  },
  {
    title: 'Fast with large trees',
    description: 'Selection updates only copy the changed branch, and unchanged nodes skip re-rendering, so trees with tens of thousands of nodes stay responsive.'
  },
  {
    title: 'Small footprint',
    description: 'About 17 KB of JavaScript and 3 KB of CSS, with no global style resets. Supports React 18 and 19, and server-side rendering.'
  }
];

export default function Home(): ReactNode {
  useEffect(() => {
    const target = legacyHashes[window.location.hash.toLowerCase()];
    if (target)
      window.location.replace(target);
  }, []);

  return (
    <Layout
      title='Accessible tree select and checkbox tree for React'
      description='React Tree Select is an accessible, customizable tree select and checkbox tree component for React with tri-state selection, keyboard navigation and TypeScript support.'
    >
      <header className={styles.hero}>
        <div className='container'>
          <Heading as='h1' className={styles.title}>React Tree Select</Heading>
          <p className={styles.subtitle}>
            An accessible, customizable tree select and checkbox tree component for React, with tri-state selection,
            keyboard navigation and TypeScript support.
          </p>
          <div className={styles.buttons}>
            <Link className='button button--primary button--lg' to='/docs/getting-started'>Get started</Link>
            <Link className='button button--secondary button--lg' to='/docs/examples'>See examples</Link>
          </div>
          <div className={styles.install}>
            <CodeBlock language='bash'>npm install @attebyte/react-tree-select</CodeBlock>
          </div>
        </div>
      </header>
      <main className='container margin-vert--xl'>
        <section>
          <Heading as='h2'>Try it</Heading>
          <p>Check, uncheck and expand nodes, or focus the tree and use the arrow keys.</p>
          <LiveExample>
            <ControlledExample />
          </LiveExample>
        </section>
        <section className='margin-top--xl'>
          <Heading as='h2'>Features</Heading>
          <div className='row'>
            {features.map(feature => (
              <div key={feature.title} className='col col--4 margin-bottom--lg'>
                <Heading as='h3'>{feature.title}</Heading>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
