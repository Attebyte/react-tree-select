import React, { useCallback, useMemo, useSyncExternalStore } from 'react';
import { NODE_ACTIVE, NODE_EXPANDED } from '../utils/TreeStore';
import { getChildren, isOwnDisabled } from '../utils/TreeUtility';
import { StandardComponentProps } from './TreeSelect';
import { TreeItemAttributes } from './TreeNode';
import { useTreeContext } from './TreeContext';

interface TreeItemProps<T> {
  node: T;
  level: number;
  disabled: boolean;
  posInSet: number;
  setSize: number;
}

// Internal wrapper around the node component: subscribes to this node's view state,
// builds the accessibility attributes, and renders child items when expanded.
const TreeItem = <T,>(props: TreeItemProps<T>) => {
  const { node, level, disabled, posInSet, setSize } = props;
  const context = useTreeContext<T>();
  const {
    store,
    uniqueIDProperty,
    labelProperty,
    valueProperty,
    childrenProperty,
    disabledProperty,
    chainedSelect,
    NodeComponent
  } = context;

  const id = node[uniqueIDProperty];
  const getState = useCallback(() => store.getNodeState(id), [store, id]);
  const state = useSyncExternalStore(store.subscribe, getState, getState);
  const expanded = (state & NODE_EXPANDED) !== 0;
  const active = (state & NODE_ACTIVE) !== 0;

  const children = getChildren(node, childrenProperty);
  const hasChildren = children.length > 0;
  // A parent whose descendants are all disabled can't change, so it's shown disabled too
  const locked = chainedSelect && disabledProperty !== undefined && context.isLocked(node);
  const inheritedDisabled = disabled || locked;
  const isDisabled = inheritedDisabled || isOwnDisabled(node, disabledProperty);
  const value = valueProperty !== undefined ? node[valueProperty] : undefined;
  const label = node[labelProperty];
  // A label that isn't text (such as a React element) can't be an accessible name; the item's content names it instead
  const accessibleName = typeof label === 'string' || typeof label === 'number' ? String(label) : undefined;

  const ref = useCallback((element: HTMLElement | null) => store.registerElement(id, element), [store, id]);
  const handleExpandedChange = useCallback((value: boolean) => store.setExpanded(id, value), [store, id]);

  const treeItemProps = useMemo<TreeItemAttributes>(() => ({
    ref,
    role: 'treeitem',
    tabIndex: active ? 0 : -1,
    'aria-label': accessibleName,
    'aria-level': level + 1,
    'aria-setsize': setSize,
    'aria-posinset': posInSet,
    'aria-expanded': hasChildren ? expanded : undefined,
    'aria-checked': valueProperty !== undefined ? (value === null ? 'mixed' : value === true) : undefined,
    'aria-disabled': isDisabled || undefined
  }), [ref, active, accessibleName, level, setSize, posInSet, hasChildren, expanded, valueProperty, value, isDisabled]);

  const standardComponentProps = useMemo<StandardComponentProps<T>>(() => ({
    node,
    expanded,
    uniqueIDProperty,
    labelProperty,
    valueProperty,
    childrenProperty,
    disabledProperty
  }), [node, expanded, uniqueIDProperty, labelProperty, valueProperty, childrenProperty, disabledProperty]);

  const childDisabled = disabled || (chainedSelect && isDisabled);

  return (
    <NodeComponent
      standardComponentProps={standardComponentProps}
      treeItemProps={treeItemProps}

      disabled={inheritedDisabled}
      level={level}
      expanded={expanded}
      defaultExpanded={context.defaultExpanded}
      expandDisabledNodes={context.expandDisabledNodes}
      chainedSelect={chainedSelect}

      className={context.nodeClassName}
      style={context.nodeStyle}
      inputClassName={context.inputClassName}
      inputStyle={context.inputStyle}
      labelClassName={context.labelClassName}
      labelStyle={context.labelStyle}
      iconClassName={context.iconClassName}
      iconStyle={context.iconStyle}

      CheckComponent={context.CheckComponent}
      LabelComponent={context.LabelComponent}
      ExpandIconComponent={context.ExpandIconComponent}

      onChange={context.onNodeChange}
      onExpandedChange={handleExpandedChange}
    >
      {hasChildren && expanded ? children.map((child, index) => (
        <MemoTreeItem
          key={`${String(child[uniqueIDProperty])}-${index}`}
          node={child}
          level={level + 1}
          disabled={childDisabled}
          posInSet={index + 1}
          setSize={children.length}
        />
      )) : undefined}
    </NodeComponent>
  );
};

const MemoTreeItem = React.memo(TreeItem) as typeof TreeItem;

export default MemoTreeItem;
