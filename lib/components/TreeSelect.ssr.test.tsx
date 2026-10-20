import { renderToString } from 'react-dom/server';
import { expect, test } from 'vitest';
import TreeSelect from '../main';

const data = [{ label: 'Root', value: 1, included: true, children: [{ label: 'Child', value: 2, included: true }] }];

test('renders controlled data on the server', () => {
  const html = renderToString(
    <TreeSelect data={data} uniqueIDProperty='value' labelProperty='label' childrenProperty='children' valueProperty='included' defaultExpanded />
  );

  expect(html).toContain('role="tree"');
  expect(html).toContain('aria-label="Root"');
  expect(html).toContain('aria-label="Child"');
  expect(html).toContain('aria-checked="true"');
  expect(html).toContain('tabindex="0"');
});
