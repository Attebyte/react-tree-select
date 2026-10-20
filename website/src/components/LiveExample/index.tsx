import type { ReactNode } from 'react';
import CodeBlock from '@theme/CodeBlock';
import '@attebyte/react-tree-select/style.css';
import styles from './styles.module.css';

interface Props {
  // The rendered example
  children: ReactNode;
  // Source code shown under the example (imported with raw-loader so it always matches)
  source?: string;
  title?: string;
}

export default function LiveExample({ children, source, title = 'Example.tsx' }: Props): ReactNode {
  return (
    <div className={styles.example}>
      <div className={styles.preview}>{children}</div>
      {source && (
        <details className={styles.source}>
          <summary>Show code</summary>
          <CodeBlock language='tsx' title={title}>{source.trim()}</CodeBlock>
        </details>
      )}
    </div>
  );
}
