import React, { useContext } from 'react';
import { TreeStore } from '../utils/TreeStore';
import { ExpandIconProps } from './ExpandIcon';
import { NodeCheckProps } from './NodeCheck';
import { NodeLabelProps } from './NodeLabel';
import { TreeNodeProps } from './TreeNode';
import { NodeChangeOptions } from './TreeSelect';

export interface TreeContextValue<T> {
  store: TreeStore<T[keyof T]>;

  uniqueIDProperty: keyof T;
  labelProperty: keyof T;
  valueProperty?: keyof T;
  childrenProperty: keyof T;
  disabledProperty?: keyof T;

  defaultExpanded?: boolean;
  expandDisabledNodes: boolean;
  chainedSelect: boolean;

  nodeClassName?: string;
  nodeStyle?: React.CSSProperties;
  labelClassName?: string;
  labelStyle?: React.CSSProperties;
  iconClassName?: string;
  iconStyle?: React.CSSProperties;
  inputClassName?: string;
  inputStyle?: React.CSSProperties;

  NodeComponent: React.ComponentType<TreeNodeProps<T>>;
  CheckComponent: React.ComponentType<NodeCheckProps<T>>;
  LabelComponent: React.ComponentType<NodeLabelProps<T>>;
  ExpandIconComponent: React.ComponentType<ExpandIconProps<T>>;

  onNodeChange: (node: T, value: boolean | null, options?: NodeChangeOptions) => void;
  // True for a parent whose descendants are all disabled (chained selection only)
  isLocked: (node: T) => boolean;
}

export const TreeContext = React.createContext<TreeContextValue<unknown> | null>(null);

export function useTreeContext<T>(): TreeContextValue<T> {
  const context = useContext(TreeContext);
  if (!context)
    throw new Error('Tree nodes must be rendered inside TreeSelect');
  return context as unknown as TreeContextValue<T>;
}
