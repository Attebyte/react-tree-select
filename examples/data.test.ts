import { describe, expect, test } from 'vitest';
import { commentData, exampleData, exampleDataWithDisabled, generateTree } from './data';

const collectIDs = (nodes: { value: number; children?: { value: number }[] }[]): number[] =>
  nodes.flatMap(node => [node.value, ...collectIDs((node.children ?? []) as typeof nodes)]);

describe('example data', () => {
  test.each([
    ['exampleData', exampleData],
    ['exampleDataWithDisabled', exampleDataWithDisabled],
    ['commentData', commentData],
    ['generateTree', generateTree([10, 10, 10, 20])]
  ])('%s has unique IDs', (_, data) => {
    const ids = collectIDs(data);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('generateTree builds the requested shape', () => {
    const tree = generateTree([10, 10, 10, 20]);
    expect(collectIDs(tree)).toHaveLength(21_110);
    expect(tree[0].children![0].children![0].children).toHaveLength(20);
    expect(tree[0].children![0].children![0].children![0].children).toBeUndefined();
  });
});
