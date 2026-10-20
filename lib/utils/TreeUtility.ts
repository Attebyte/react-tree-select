export type NodeValue = boolean | null | undefined;

export interface TreeKeys<T> {
  uniqueIDProperty: keyof T;
  childrenProperty: keyof T;
  valueProperty?: keyof T;
  disabledProperty?: keyof T;
}

export interface TreeIndex<T> {
  // First node found for each unique ID
  byID: Map<T[keyof T], T>;
  // Parent of each node, null for root nodes
  parentOf: Map<T, T | null>;
  // IDs used by more than one node
  duplicateIDs: Set<T[keyof T]>;
}

const EMPTY: never[] = [];

export function getChildren<T>(node: T, childrenProperty: keyof T): T[] {
  const children = node[childrenProperty];
  return Array.isArray(children) ? children : EMPTY;
}

export function buildIndex<T>(tree: T[], keys: TreeKeys<T>): TreeIndex<T> {
  const byID = new Map<T[keyof T], T>();
  const parentOf = new Map<T, T | null>();
  const duplicateIDs = new Set<T[keyof T]>();

  const visit = (nodes: T[], parent: T | null) => nodes.forEach(node => {
    parentOf.set(node, parent);

    // Keep the first node in display order when IDs repeat
    const id = node[keys.uniqueIDProperty];
    if (!byID.has(id))
      byID.set(id, node);
    else
      duplicateIDs.add(id);

    visit(getChildren(node, keys.childrenProperty), node);
  });
  visit(tree, null);

  return { byID, parentOf, duplicateIDs };
}

export function isOwnDisabled<T>(node: T, disabledProperty?: keyof T): boolean {
  return disabledProperty !== undefined && node[disabledProperty] === true;
}

// Unset counts as unchecked; null (mixed) stays distinct
const normalize = (value: NodeValue) => value === undefined ? false : value;

// With chained selection a parent's value is derived from its children, so a parent whose descendants are
// all disabled can never change. Cached per node object, which is safe because nodes are never modified.
export function createLockedCheck<T>(keys: TreeKeys<T>): (node: T) => boolean {
  const cache = new WeakMap<object, boolean>();

  const isLocked = (node: T): boolean => {
    const children = getChildren(node, keys.childrenProperty);
    if (children.length === 0)
      return false;

    const key = node as unknown as object;
    const cached = cache.get(key);
    if (cached !== undefined)
      return cached;

    const locked = children.every(child => isOwnDisabled(child, keys.disabledProperty) || isLocked(child));
    cache.set(key, locked);
    return locked;
  };

  return isLocked;
}

// Disabled by the tree, by the node itself, or (when chained) by a disabled ancestor or having no enabled descendants
export function isNodeDisabled<T>(index: TreeIndex<T>, node: T, keys: TreeKeys<T>, treeDisabled: boolean, chainedSelect: boolean, isLocked?: (node: T) => boolean): boolean {
  if (treeDisabled || isOwnDisabled(node, keys.disabledProperty))
    return true;

  if (!chainedSelect)
    return false;

  if (isLocked?.(node))
    return true;

  let parent = index.parentOf.get(node);
  while (parent) {
    if (isOwnDisabled(parent, keys.disabledProperty))
      return true;
    parent = index.parentOf.get(parent);
  }

  return false;
}

// Computes every node whose value changes when `startingNode` is set to `newValue`.
// Chained updates cascade to enabled descendants, then derive every parent in the cascade and every
// ancestor from its children, so a parent is only checked when everything under it is checked.
// `toggle` marks a click or key press that toggles the node, as opposed to setting a value programmatically.
export function computeSelectionUpdates<T>(index: TreeIndex<T>, startingNode: T, newValue: boolean | null, keys: TreeKeys<T>, chainedSelect: boolean, toggle = false): Map<T, NodeValue> {
  const updates = new Map<T, NodeValue>();
  const valueProperty = keys.valueProperty;
  if (valueProperty === undefined)
    return updates;

  if (!chainedSelect) {
    updates.set(startingNode, newValue);
    return updates;
  }

  const currentValue = (node: T) => node[valueProperty] as NodeValue;
  const valueOf = (node: T): NodeValue => updates.has(node) ? updates.get(node) : currentValue(node);

  // Mixed when children disagree or any child is already mixed, otherwise the shared value
  const aggregate = (children: T[]): NodeValue => {
    const valueSet = new Set(children.map(child => normalize(valueOf(child))));
    return valueSet.size > 1 ? null : [...valueSet][0];
  };

  const cascade = (node: T, value: boolean | null): void => {
    if (isOwnDisabled(node, keys.disabledProperty)) return; // Disabled nodes keep their value and shield their descendants
    const children = getChildren(node, keys.childrenProperty);
    children.forEach(child => cascade(child, value));
    updates.set(node, children.length > 0 ? aggregate(children) : value);
  };

  const apply = (value: boolean | null) => {
    updates.clear();
    if (isOwnDisabled(startingNode, keys.disabledProperty))
      updates.set(startingNode, value);
    else
      cascade(startingNode, value);
  };

  apply(newValue);

  // Toggling a mixed parent whose enabled descendants are already all checked (the rest are disabled)
  // would otherwise leave it stuck on mixed, so treat it as unchecking instead
  const isMixedParent = currentValue(startingNode) === null && getChildren(startingNode, keys.childrenProperty).length > 0;
  const unchanged = [...updates].every(([node, value]) => normalize(currentValue(node)) === normalize(value));
  if (toggle && newValue === true && isMixedParent && unchanged)
    apply(false);

  let parent = index.parentOf.get(startingNode);
  while (parent) {
    updates.set(parent, aggregate(getChildren(parent, keys.childrenProperty)));
    parent = index.parentOf.get(parent);
  }

  return updates;
}

export type SelectionMode = 'all' | 'leaves' | 'topmost';

export interface SelectedNodesOptions<T> {
  childrenProperty: keyof T;
  valueProperty: keyof T;
  // 'all': every checked node. 'leaves': checked nodes without children.
  // 'topmost': checked nodes whose ancestors are not checked, so a checked parent stands in for its subtree.
  mode?: SelectionMode;
}

export interface SelectedIDsOptions<T> extends SelectedNodesOptions<T> {
  uniqueIDProperty: keyof T;
}

// Checked nodes (value === true) in display order. Mixed (null) nodes are not selected.
export function getSelectedNodes<T>(data: T[], options: SelectedNodesOptions<T>): T[] {
  const { childrenProperty, valueProperty, mode = 'all' } = options;
  const selected: T[] = [];

  const visit = (nodes: T[]) => nodes.forEach(node => {
    const children = getChildren(node, childrenProperty);
    const checked = node[valueProperty] === true;

    if (checked && mode === 'topmost') {
      selected.push(node);
      return;
    }

    if (checked && (mode === 'all' || children.length === 0))
      selected.push(node);
    visit(children);
  });
  visit(data);

  return selected;
}

export function getSelectedIDs<T>(data: T[], options: SelectedIDsOptions<T>): T[keyof T][] {
  return getSelectedNodes(data, options).map(node => node[options.uniqueIDProperty]);
}

// Returns a new tree with `updates` applied. Only updated nodes and their ancestors are copied;
// every other subtree keeps its identity so memoized nodes can skip rendering.
export function applySelectionUpdates<T>(tree: T[], index: TreeIndex<T>, updates: Map<T, NodeValue>, keys: TreeKeys<T>): T[] {
  const valueProperty = keys.valueProperty;
  if (valueProperty === undefined || updates.size === 0)
    return tree;

  const affected = new Set<T>();
  updates.forEach((_, node) => {
    let current: T | null | undefined = node;
    while (current && !affected.has(current)) {
      affected.add(current);
      current = index.parentOf.get(current);
    }
  });

  const rebuild = (nodes: T[]): T[] => {
    let changed = false;
    const result = nodes.map(node => {
      if (!affected.has(node))
        return node;

      let next = node;
      // Unset and false mean the same thing, so don't copy a node to swap one for the other
      if (updates.has(node) && normalize(node[valueProperty] as NodeValue) !== normalize(updates.get(node)))
        next = { ...node, [valueProperty]: updates.get(node) };

      const children = node[keys.childrenProperty];
      if (Array.isArray(children)) {
        const nextChildren = rebuild(children);
        if (nextChildren !== children)
          next = { ...next, [keys.childrenProperty]: nextChildren };
      }

      if (next !== node)
        changed = true;
      return next;
    });

    return changed ? result : nodes;
  };

  return rebuild(tree);
}

// Nodes in display order, descending only into expanded nodes
export function getVisibleNodes<T>(tree: T[], keys: TreeKeys<T>, isExpanded: (id: T[keyof T]) => boolean): T[] {
  const visible: T[] = [];
  const visit = (nodes: T[]) => nodes.forEach(node => {
    visible.push(node);
    if (isExpanded(node[keys.uniqueIDProperty]))
      visit(getChildren(node, keys.childrenProperty));
  });
  visit(tree);
  return visible;
}
