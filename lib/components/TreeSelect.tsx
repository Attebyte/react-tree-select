import React, { useCallback, useMemo, useRef, useState } from 'react';
import { TreeStore } from '../utils/TreeStore';
import { applySelectionUpdates, buildIndex, computeSelectionUpdates, createLockedCheck, getChildren, getVisibleNodes, isNodeDisabled, TreeKeys } from '../utils/TreeUtility';
import { TreeNodeProps } from './TreeNode';
import { NodeCheckProps } from './NodeCheck';
import { NodeLabelProps } from './NodeLabel';
import { ExpandIconProps } from './ExpandIcon';
import TreeNode from './TreeNode';
import NodeCheck from './NodeCheck';
import NodeLabel from './NodeLabel';
import ExpandIcon from './ExpandIcon';
import TreeItem from './TreeItem';
import { TreeContext, TreeContextValue } from './TreeContext';
import { useIsomorphicLayoutEffect } from '../utils/useIsomorphicLayoutEffect';

export interface StandardComponentProps<T> {
  node: T;
  expanded?: boolean;
  uniqueIDProperty: keyof T;
  labelProperty: keyof T;
  valueProperty?: keyof T;
  childrenProperty: keyof T;
  disabledProperty?: keyof T;
}

export interface NodeChangeOptions {
  // The change comes from a click or key press that toggles the node. Toggling a mixed parent whose enabled
  // descendants are already all checked unchecks them instead of leaving it mixed.
  toggle?: boolean;
}

export interface TreeSelectProps<T> extends Omit<React.HTMLProps<HTMLDivElement>, "data" | "onChange">, Omit<StandardComponentProps<T>, "node" | "expanded"> {
  data?: T[];
  defaultData?: T[];

  disabled?: boolean;
  expandDisabledNodes?: boolean;
  defaultExpanded?: boolean;
  chainedSelect?: boolean;

  nodeClassName?: string;
  nodeStyle?: React.CSSProperties;
  labelClassName?: string;
  labelStyle?: React.CSSProperties;
  iconClassName?: string;
  iconStyle?: React.CSSProperties;
  inputClassName?: string;
  inputStyle?: React.CSSProperties;

  CustomNodeComponent?: React.ComponentType<TreeNodeProps<T>>;
  CustomCheckComponent?: React.ComponentType<NodeCheckProps<T>>;
  CustomLabelComponent?: React.ComponentType<NodeLabelProps<T>>;
  CustomExpandIconComponent?: React.ComponentType<ExpandIconProps<T>>;

  onChange?: (data: T[]) => void;
}

// The same props for a tree with a single root node: `data`, `defaultData` and `onChange` use the node itself
export interface SingleRootTreeSelectProps<T> extends Omit<TreeSelectProps<T>, 'data' | 'defaultData' | 'onChange'> {
  data?: T;
  defaultData?: T;
  onChange?: (data: T) => void;
}

// Overloads so `onChange` reports the same shape (array or single root) that was passed in
export interface TreeSelectComponent {
  <T>(props: TreeSelectProps<T>): React.JSX.Element;
  <T>(props: SingleRootTreeSelectProps<T>): React.JSX.Element;
}

const EMPTY: never[] = [];

const toArray = <T,>(value: T | T[] | undefined): T[] | undefined =>
  value == null ? undefined : Array.isArray(value) ? value : [value];

const TreeSelectImpl = <T,>(props: TreeSelectProps<T> | SingleRootTreeSelectProps<T>) => {
  const {
    data,
    defaultData,
    uniqueIDProperty,
    labelProperty,
    valueProperty,
    childrenProperty,
    disabledProperty,
    disabled = false,
    expandDisabledNodes = true,
    defaultExpanded = false,
    chainedSelect = true,
    nodeClassName,
    nodeStyle,
    labelClassName,
    labelStyle,
    iconClassName,
    iconStyle,
    inputClassName,
    inputStyle,
    CustomNodeComponent,
    CustomCheckComponent,
    CustomLabelComponent,
    CustomExpandIconComponent,
    onChange,
    onKeyDown,
    onFocus,
    ...rest
  } = props;

  // `data` makes the tree controlled: it renders exactly what it is given and only reports changes
  const isControlled = data != null;
  const controlledData = useMemo(() => toArray<T>(data), [data]);
  const [internalData, setInternalData] = useState(() => toArray<T>(defaultData));
  const tree: T[] = (isControlled ? controlledData : internalData) ?? EMPTY;

  // A single root node (rather than an array) is reported back to onChange in the same shape
  const [defaultIsSingleRoot] = useState(() => defaultData != null && !Array.isArray(defaultData));
  const isSingleRoot = isControlled ? !Array.isArray(data) : defaultIsSingleRoot;

  const keys = useMemo<TreeKeys<T>>(
    () => ({ uniqueIDProperty, childrenProperty, valueProperty, disabledProperty }),
    [uniqueIDProperty, childrenProperty, valueProperty, disabledProperty]
  );
  const index = useMemo(() => buildIndex(tree, keys), [tree, keys]);
  const isLocked = useMemo(() => createLockedCheck(keys), [keys]);

  const [store] = useState(() => new TreeStore<T[keyof T]>(defaultExpanded, tree.length > 0 ? tree[0][uniqueIDProperty] : undefined));

  // Result of earlier changes that haven't rendered yet, so several onChange calls before a re-render compose
  const pendingTree = useRef<T[] | null>(null);

  // Read by the stable callbacks below so they never go stale; synced after commit so a discarded
  // concurrent render can't leave them pointing at data that never rendered
  const latest = useRef({ tree, index, keys, isControlled, isSingleRoot, chainedSelect, onChange });
  useIsomorphicLayoutEffect(() => {
    latest.current = { tree, index, keys, isControlled, isSingleRoot, chainedSelect, onChange };
    if (pendingTree.current === tree)
      pendingTree.current = null;
  });

  const warnedDuplicates = useRef(false);
  useIsomorphicLayoutEffect(() => {
    if (index.duplicateIDs.size === 0 || warnedDuplicates.current)
      return;

    warnedDuplicates.current = true;
    const examples = [...index.duplicateIDs].slice(0, 5).map(String).join(', ');
    console.warn(`TreeSelect: several nodes share the same ${String(keys.uniqueIDProperty)} (${examples}). Each node needs a unique ID for selection, expansion and keyboard navigation to work correctly.`);
  }, [index, keys]);

  useIsomorphicLayoutEffect(() => {
    store.setParentResolver((id) => {
      const node = index.byID.get(id);
      const parent = node ? index.parentOf.get(node) : null;
      return parent ? parent[keys.uniqueIDProperty] : undefined;
    });
    store.setDefaultExpanded(defaultExpanded);

    // Keep exactly one reachable tab stop when the active node is removed or hidden
    const activeID = store.getActiveID();
    const activeVisible = activeID !== undefined && index.byID.has(activeID) && !hasCollapsedAncestor(store, activeID);
    if (!activeVisible)
      store.setActive(tree.length > 0 ? tree[0][keys.uniqueIDProperty] : undefined);
  }, [store, tree, index, keys, defaultExpanded]);

  const handleNodeChange = useCallback((node: T, value: boolean | null, options?: NodeChangeOptions) => {
    const { keys, isControlled, isSingleRoot, chainedSelect, onChange } = latest.current;
    if (keys.valueProperty === undefined)
      return;

    const tree = pendingTree.current ?? latest.current.tree;
    const index = pendingTree.current ? buildIndex(tree, keys) : latest.current.index;

    // Custom components may hand back a copy of the node, so fall back to its unique ID
    const target = index.parentOf.has(node) ? node : index.byID.get(node[keys.uniqueIDProperty]);
    if (target === undefined)
      return;

    const updates = computeSelectionUpdates(index, target, value, keys, chainedSelect, options?.toggle);
    const nextTree = applySelectionUpdates(tree, index, updates, keys);
    if (nextTree === tree)
      return;

    // Uncontrolled changes always re-render, which clears this in the layout effect above. A controlled
    // parent may ignore the change, so also clear it once the current event finishes.
    if (isControlled && pendingTree.current === null)
      queueMicrotask(() => {
        pendingTree.current = null;
      });
    pendingTree.current = nextTree;

    if (!isControlled)
      setInternalData(nextTree);
    (onChange as ((data: T | T[]) => void) | undefined)?.(isSingleRoot ? nextTree[0] : nextTree);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    // Leave modified keys (Alt+Left for back, Ctrl+Home, ...) to the browser
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey)
      return;

    // Only handle keys pressed on a tree item itself, not on controls rendered inside custom nodes
    const id = store.getIDForElement(e.target);
    const node = id !== undefined ? index.byID.get(id) : undefined;
    if (id === undefined || node == null)
      return;

    const children = getChildren(node, childrenProperty);
    const hasChildren = children.length > 0;
    const expanded = store.isExpanded(id);
    const nodeDisabled = isNodeDisabled(index, node, keys, disabled, chainedSelect, isLocked);
    const canToggle = hasChildren && (expandDisabledNodes || !nodeDisabled);

    const focusNode = (target: T | null | undefined) => {
      if (target)
        store.focus(target[uniqueIDProperty]);
    };
    const visibleNodes = () => getVisibleNodes(tree, keys, nodeID => store.isExpanded(nodeID));

    switch (e.key) {
      case 'ArrowDown': {
        const visible = visibleNodes();
        focusNode(visible[visible.indexOf(node) + 1]);
        break;
      }
      case 'ArrowUp': {
        const visible = visibleNodes();
        focusNode(visible[visible.indexOf(node) - 1]);
        break;
      }
      case 'Home':
        focusNode(tree[0]);
        break;
      case 'End': {
        const visible = visibleNodes();
        focusNode(visible[visible.length - 1]);
        break;
      }
      case 'ArrowRight':
        if (hasChildren && !expanded && canToggle)
          store.setExpanded(id, true);
        else if (hasChildren && expanded)
          focusNode(children[0]);
        break;
      case 'ArrowLeft':
        if (hasChildren && expanded && canToggle)
          store.setExpanded(id, false);
        else
          focusNode(index.parentOf.get(node));
        break;
      case 'Enter':
        // Same as clicking the label
        if (canToggle)
          store.setExpanded(id, !expanded);
        else if (!nodeDisabled && valueProperty !== undefined)
          handleNodeChange(node, node[valueProperty] !== true, { toggle: true });
        break;
      case ' ':
        // Same as clicking the checkbox
        if (!nodeDisabled && valueProperty !== undefined)
          handleNodeChange(node, node[valueProperty] !== true, { toggle: true });
        break;
      default:
        return;
    }

    e.preventDefault();
  };

  const handleFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    onFocus?.(e);

    const id = store.getIDForElement(e.target);
    if (id !== undefined)
      store.setActive(id);
  };

  const context = useMemo<TreeContextValue<T>>(() => ({
    store,
    uniqueIDProperty,
    labelProperty,
    valueProperty,
    childrenProperty,
    disabledProperty,
    defaultExpanded,
    expandDisabledNodes,
    chainedSelect,
    nodeClassName,
    nodeStyle,
    labelClassName,
    labelStyle,
    iconClassName,
    iconStyle,
    inputClassName,
    inputStyle,
    NodeComponent: CustomNodeComponent || TreeNode,
    CheckComponent: CustomCheckComponent || NodeCheck,
    LabelComponent: CustomLabelComponent || NodeLabel,
    ExpandIconComponent: CustomExpandIconComponent || ExpandIcon,
    onNodeChange: handleNodeChange,
    isLocked
  }), [
    store, uniqueIDProperty, labelProperty, valueProperty, childrenProperty, disabledProperty,
    defaultExpanded, expandDisabledNodes, chainedSelect,
    nodeClassName, nodeStyle, labelClassName, labelStyle, iconClassName, iconStyle, inputClassName, inputStyle,
    CustomNodeComponent, CustomCheckComponent, CustomLabelComponent, CustomExpandIconComponent, handleNodeChange, isLocked
  ]);

  return (
    <div
      role='tree'
      aria-multiselectable={valueProperty !== undefined ? true : undefined}
      {...rest}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
    >
      <TreeContext.Provider value={context as unknown as TreeContextValue<unknown>}>
        {tree.map((node, index) => (
          <TreeItem
            key={`${String(node[uniqueIDProperty])}-${index}`}
            node={node}
            level={0}
            disabled={disabled}
            posInSet={index + 1}
            setSize={tree.length}
          />
        ))}
      </TreeContext.Provider>
    </div>
  );
};

export const TreeSelect = TreeSelectImpl as TreeSelectComponent;

function hasCollapsedAncestor<K>(store: TreeStore<K>, id: K): boolean {
  let parentID = store.getParentID(id);
  while (parentID !== undefined) {
    if (!store.isExpanded(parentID))
      return true;
    parentID = store.getParentID(parentID);
  }
  return false;
}
