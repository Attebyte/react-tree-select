import { applySelectionUpdates, buildIndex, computeSelectionUpdates, createLockedCheck, getSelectedIDs, getSelectedNodes, getVisibleNodes, isNodeDisabled, TreeKeys } from "./TreeUtility";
import { test, expect, describe } from 'vitest';

interface Node {
    name: string;
    id: number;
    included?: boolean | null;
    disabled?: boolean;
    children?: Node[];
}

const TestTree: Node = {
    "name": "root",
    "id": 1,
    "children": [
        {
            "name": "child1",
            "id": 2,
            "children": [
                {
                    "name": "child1.1",
                    "id": 3
                },
                {
                    "name": "child1.2",
                    "id": 4
                }
            ]
        },
        {
            "name": "child2",
            "id": 5,
            "children": [
                {
                    "name": "child2.1",
                    "id": 6
                },
                {
                    "name": "child2.2",
                    "id": 7
                }
            ]
        }
    ]
}

const keys: TreeKeys<Node> = { uniqueIDProperty: 'id', childrenProperty: 'children', valueProperty: 'included', disabledProperty: 'disabled' };

const select = (tree: Node[], id: number, value: boolean | null, chained = true, toggle = false) => {
    const index = buildIndex(tree, keys);
    const updates = computeSelectionUpdates(index, index.byID.get(id)!, value, keys, chained, toggle);
    return applySelectionUpdates(tree, index, updates, keys);
};

describe('buildIndex', () => {
    test('maps IDs and parents', () => {
        const tree = [structuredClone(TestTree)];
        const index = buildIndex(tree, keys);
        expect(index.byID.get(4)?.name).toBe("child1.2");
        expect(index.parentOf.get(tree[0])).toBeNull();
        expect(index.parentOf.get(tree[0].children![0])).toBe(tree[0]);
        expect(index.parentOf.get(tree[0].children![0].children![1])).toBe(tree[0].children![0]);
    });

    test('keeps the first node when IDs repeat', () => {
        const tree: Node[] = [{ name: 'first', id: 1, children: [{ name: 'dup', id: 1 }] }];
        expect(buildIndex(tree, keys).byID.get(1)?.name).toBe('first');
    });

    test('does not modify the tree', () => {
        const tree = [structuredClone(TestTree)];
        buildIndex(tree, keys);
        expect(tree).toEqual([TestTree]);
    });
});

describe('selection', () => {
    test('parent selection cascades to all descendants', () => {
        const result = select([structuredClone(TestTree)], 1, true);
        expect(result[0].included).toBe(true);
        expect(result[0].children![0].included).toBe(true);
        expect(result[0].children![1].included).toBe(true);
        expect(result[0].children![0].children![0].included).toBe(true);
        expect(result[0].children![0].children![1].included).toBe(true);
        expect(result[0].children![1].children![0].included).toBe(true);
        expect(result[0].children![1].children![1].included).toBe(true);
    });

    test('child selection marks ancestors mixed', () => {
        const result = select([structuredClone(TestTree)], 2, true);
        expect(result[0].included).toBe(null);
        expect(result[0].children![0].included).toBe(true);
        expect(result[0].children![1].included).toBe(undefined);
        expect(result[0].children![0].children![0].included).toBe(true);
        expect(result[0].children![0].children![1].included).toBe(true);
        expect(result[0].children![1].children![0].included).toBe(undefined);
        expect(result[0].children![1].children![1].included).toBe(undefined);
    });

    test('selecting every child selects the parent', () => {
        let tree = select([structuredClone(TestTree)], 3, true);
        expect(tree[0].children![0].included).toBe(null);
        tree = select(tree, 4, true);
        expect(tree[0].children![0].included).toBe(true);
        expect(tree[0].included).toBe(null);
    });

    test('deselecting returns ancestors to unselected', () => {
        let tree = select([structuredClone(TestTree)], 3, true);
        tree = select(tree, 3, false);
        expect(tree[0].children![0].children![0].included).toBe(false);
        expect(tree[0].children![0].included).toBe(false);
        expect(tree[0].included).toBe(false);
    });

    test('unchained selection only changes the target', () => {
        const result = select([structuredClone(TestTree)], 2, true, false);
        expect(result[0].included).toBe(undefined);
        expect(result[0].children![0].included).toBe(true);
        expect(result[0].children![0].children![0].included).toBe(undefined);
    });

    test('disabled nodes keep their value and shield descendants', () => {
        const tree = [structuredClone(TestTree)];
        tree[0].children![0].disabled = true;
        const result = select(tree, 1, true);
        expect(result[0].children![0].included).toBe(undefined);
        expect(result[0].children![0].children![0].included).toBe(undefined);
        expect(result[0].children![1].included).toBe(true);
        expect(result[0].children![1].children![0].included).toBe(true);
        // Not everything under the root is checked, so it is mixed rather than checked
        expect(result[0].included).toBe(null);
    });

    test('a parent with a disabled child is mixed at every level of the cascade', () => {
        const tree = [structuredClone(TestTree)];
        tree[0].children![0].children![1].disabled = true;
        const result = select(tree, 1, true);
        expect(result[0].children![0].children![0].included).toBe(true);
        expect(result[0].children![0].children![1].included).toBe(undefined);
        expect(result[0].children![0].included).toBe(null);
        expect(result[0].children![1].included).toBe(true);
        expect(result[0].included).toBe(null);
    });

    test('toggling a mixed parent whose enabled descendants are all checked unchecks them', () => {
        const tree = [structuredClone(TestTree)];
        tree[0].children![0].children![1].disabled = true;
        let result = select(tree, 1, true, true, true);
        expect(result[0].included).toBe(null);

        // Checking it again would change nothing, so it toggles off instead of staying stuck
        result = select(result, 1, true, true, true);
        expect(result[0].children![0].children![0].included).toBe(false);
        expect(result[0].children![1].children![1].included).toBe(false);
        expect(result[0].children![0].children![1].included).toBe(undefined);
        expect(result[0].included).toBe(false);
    });

    test('setting a stuck mixed parent to true programmatically changes nothing', () => {
        const tree = [structuredClone(TestTree)];
        tree[0].children![0].children![1].disabled = true;
        const checked = select(tree, 1, true);
        expect(select(checked, 1, true)).toBe(checked);
    });

    test('derived parent values do not depend on child order', () => {
        // child1 is disabled and unset, child2 is enabled; unchecking child2 must leave the root unchecked (false)
        const tree = [structuredClone(TestTree)];
        tree[0].children![0].disabled = true;
        let result = select(tree, 5, true);
        expect(result[0].included).toBe(null);
        result = select(result, 5, false);
        expect(result[0].included).toBe(false);

        const mirrored = [structuredClone(TestTree)];
        mirrored[0].children!.reverse();
        mirrored[0].children![1].disabled = true;
        let mirroredResult = select(mirrored, 5, true);
        mirroredResult = select(mirroredResult, 5, false);
        expect(mirroredResult[0].included).toBe(false);
    });

    test('a parent whose children are all disabled is locked', () => {
        const tree = [structuredClone(TestTree)];
        tree[0].children![1].children!.forEach(child => child.disabled = true);
        const isLocked = createLockedCheck(keys);
        expect(isLocked(tree[0].children![1])).toBe(true);
        expect(isLocked(tree[0])).toBe(false);
        expect(isLocked(tree[0].children![1].children![0])).toBe(false);

        const index = buildIndex(tree, keys);
        expect(isNodeDisabled(index, tree[0].children![1], keys, false, true, isLocked)).toBe(true);
        expect(isNodeDisabled(index, tree[0].children![1], keys, false, false, isLocked)).toBe(false);
        // Selecting it changes nothing
        expect(select(tree, 5, true)).toBe(tree);
    });

    test('a parent is locked when every descendant path ends in a disabled node', () => {
        const tree = [structuredClone(TestTree)];
        tree[0].children![0].children!.forEach(child => child.disabled = true);
        tree[0].children![1].disabled = true;
        expect(createLockedCheck(keys)(tree[0])).toBe(true);
    });

    test('checking a mixed parent with unchecked enabled descendants checks them', () => {
        let tree = select([structuredClone(TestTree)], 3, true);
        expect(tree[0].included).toBe(null);
        tree = select(tree, 1, true);
        expect(tree[0].included).toBe(true);
        expect(tree[0].children![1].children![1].included).toBe(true);
    });

    test('a checked disabled child keeps its parent mixed when unchecking', () => {
        const tree = [structuredClone(TestTree)];
        tree[0].children![1].children![0] = { ...tree[0].children![1].children![0], included: true, disabled: true };
        const result = select(tree, 5, false);
        expect(result[0].children![1].children![0].included).toBe(true);
        expect(result[0].children![1].children![1].included).toBeFalsy();
        expect(result[0].children![1].included).toBe(null);
    });

    test('setting an already checked leaf keeps it checked', () => {
        let tree = select([structuredClone(TestTree)], 3, true);
        tree = select(tree, 3, true);
        expect(tree[0].children![0].children![0].included).toBe(true);
    });

    test('does not mutate the input and shares unchanged subtrees', () => {
        const tree = [structuredClone(TestTree), { name: 'other', id: 8, children: [{ name: 'other.1', id: 9 }] }];
        const snapshot = structuredClone(tree);
        const result = select(tree, 3, true);

        expect(tree).toEqual(snapshot);
        expect(result).not.toBe(tree);
        expect(result[0]).not.toBe(tree[0]);
        expect(result[0].children![0]).not.toBe(tree[0].children![0]);
        // Untouched branches keep their identity
        expect(result[0].children![0].children![1]).toBe(tree[0].children![0].children![1]);
        expect(result[1]).toBe(tree[1]);
    });

    test('preserves non-cloneable values on nodes', () => {
        const onSelect = () => 'kept';
        const tree = [{ ...structuredClone(TestTree), onSelect }];
        const result = select(tree, 1, true) as typeof tree;
        expect(result[0].onSelect).toBe(onSelect);
    });

    test('returns the same tree without a value property', () => {
        const tree = [structuredClone(TestTree)];
        const noValueKeys: TreeKeys<Node> = { uniqueIDProperty: 'id', childrenProperty: 'children' };
        const index = buildIndex(tree, noValueKeys);
        const updates = computeSelectionUpdates(index, tree[0], true, noValueKeys, true);
        expect(applySelectionUpdates(tree, index, updates, noValueKeys)).toBe(tree);
    });
});

describe('isNodeDisabled', () => {
    test('inherits from disabled ancestors only when chained', () => {
        const tree = [structuredClone(TestTree)];
        tree[0].children![0].disabled = true;
        const index = buildIndex(tree, keys);
        const grandchild = index.byID.get(3)!;
        expect(isNodeDisabled(index, grandchild, keys, false, true)).toBe(true);
        expect(isNodeDisabled(index, grandchild, keys, false, false)).toBe(false);
        expect(isNodeDisabled(index, index.byID.get(6)!, keys, false, true)).toBe(false);
        expect(isNodeDisabled(index, index.byID.get(6)!, keys, true, true)).toBe(true);
    });
});

describe('getVisibleNodes', () => {
    test('descends only into expanded nodes', () => {
        const tree = [structuredClone(TestTree)];
        const visible = getVisibleNodes(tree, keys, id => id === 1 || id === 5);
        expect(visible.map(node => node.id)).toEqual([1, 2, 5, 6, 7]);
    });
});

describe('getSelectedIDs', () => {
    const options = { uniqueIDProperty: 'id', childrenProperty: 'children', valueProperty: 'included' } as const;
    // child1 fully checked, child2.1 checked, so the root and child2 are mixed
    const tree = select(select([structuredClone(TestTree)], 2, true), 6, true);

    test('all returns every checked node', () => {
        expect(getSelectedIDs(tree, options)).toEqual([2, 3, 4, 6]);
    });

    test('leaves returns checked nodes without children', () => {
        expect(getSelectedIDs(tree, { ...options, mode: 'leaves' })).toEqual([3, 4, 6]);
    });

    test('topmost lets a checked parent stand in for its subtree', () => {
        expect(getSelectedIDs(tree, { ...options, mode: 'topmost' })).toEqual([2, 6]);
        const all = select([structuredClone(TestTree)], 1, true);
        expect(getSelectedIDs(all, { ...options, mode: 'topmost' })).toEqual([1]);
    });

    test('getSelectedNodes returns the nodes themselves', () => {
        expect(getSelectedNodes(tree, { ...options, mode: 'leaves' }).map(node => node.name)).toEqual(['child1.1', 'child1.2', 'child2.1']);
    });

    test('returns nothing when nothing is checked', () => {
        expect(getSelectedIDs([structuredClone(TestTree)], options)).toEqual([]);
    });
});

describe('getSelectedIDs with a single root', () => {
    test('accepts a single root node', () => {
        const [root] = select([structuredClone(TestTree)], 2, true);
        expect(getSelectedIDs(root, { uniqueIDProperty: 'id', childrenProperty: 'children', valueProperty: 'included', mode: 'leaves' })).toEqual([3, 4]);
    });
});
