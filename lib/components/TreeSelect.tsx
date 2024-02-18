import React, { useEffect, useRef, useState } from 'react';
import { TreeUtility } from '../utils/TreeUtility';
import TreeNode, { TreeNodeProps } from './TreeNode';
import NodeCheck, { NodeCheckProps } from './NodeCheck';
import NodeLabel, { NodeLabelProps } from './NodeLabel';
import ExpandIcon, { ExpandIconProps } from './ExpandIcon';

type ExtendedNode<T> = T & { parentID?: string | number };

export interface StandardComponentProps<T> {
  node: T;
  expanded?: boolean;
  uniqueIDProperty: keyof T;
  labelProperty: keyof T;
  valueProperty?: keyof T;
  childrenProperty: keyof T;
  disabledProperty?: keyof T;
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

export const TreeSelect = <T,>(props: TreeSelectProps<T>) => {
  const {
    data,
    defaultData,
    uniqueIDProperty,
    labelProperty,
    valueProperty,
    childrenProperty,
    disabledProperty,
    disabled,
    expandDisabledNodes = true,
    defaultExpanded,
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
    ...rest
  } = props;

  let defaultTree: T[] | null = null;
  if (props.defaultData && !props.data) {
    defaultTree = structuredClone(props.defaultData);
    TreeUtility.initializeTree(defaultTree as ExtendedNode<T>[], '_parentID' as keyof T, props.childrenProperty, props.uniqueIDProperty);
  }

  const mutableTree = useRef<any[] | null>(defaultTree);
  const [renderTree, setRenderTree] = useState<any[] | null>(defaultTree);

  useEffect(() => {
    if (!props.data)
      return;

    let internalTree = structuredClone(props.data);
    TreeUtility.initializeTree(internalTree as ExtendedNode<T>[], '_parentID' as keyof T, props.childrenProperty, props.uniqueIDProperty);

    mutableTree.current = internalTree;
    setRenderTree(internalTree);
  }, [props.data, props.childrenProperty, props.uniqueIDProperty, '_parentID']);

  const handleNodeChange = (node: T, value: boolean | null) => {
    if (!mutableTree.current || !props.valueProperty)
      return;

    let updNode = TreeUtility.getNode(mutableTree.current, props.childrenProperty, props.uniqueIDProperty, node[props.uniqueIDProperty]);

    if (updNode) {
      updNode[props.valueProperty] = value as ExtendedNode<T>[keyof T];


      if (chainedSelect) {
        TreeUtility.chainUpdate(mutableTree.current, updNode, '_parentID' as keyof T, props.childrenProperty, props.valueProperty, props.uniqueIDProperty, value, props.disabledProperty);
      }

      // let cleaned = props.parentIDProperty ? mutableTree.current : TreeUtility.omitParentID(mutableTree.current, props.childrenProperty as Exclude<keyof T, "parentID">) as T[];

      setRenderTree(structuredClone(mutableTree.current));
      if (props.onChange)
        props.onChange(TreeUtility.omitParentID(mutableTree.current, childrenProperty));
    }
  }

  const NodeComponent = CustomNodeComponent || TreeNode;
  const LabelComponent = CustomLabelComponent || NodeLabel;
  const CheckComponent = CustomCheckComponent || NodeCheck;
  const ExpandIconComponent = CustomExpandIconComponent || ExpandIcon;

  return (
    <div {...rest}>
      {renderTree && (renderTree as ExtendedNode<T[]>).map((node, index) => {
        return (
          <NodeComponent
            key={`${node[props.uniqueIDProperty]}-${index}`}
            standardComponentProps={{
              node,
              uniqueIDProperty: props.uniqueIDProperty,
              labelProperty: props.labelProperty,
              valueProperty: props.valueProperty,
              childrenProperty: props.childrenProperty,
              disabledProperty: props.disabledProperty
            }}

            defaultExpanded={props.defaultExpanded}
            disabled={props.disabled}
            expandDisabledNodes={expandDisabledNodes}
            chainedSelect={chainedSelect}

            className={props.nodeClassName}
            style={props.nodeStyle}
            labelClassName={props.labelClassName}
            labelStyle={props.labelStyle}
            iconClassName={props.iconClassName}
            iconStyle={props.iconStyle}


            CheckComponent={CheckComponent}
            LabelComponent={LabelComponent}
            ExpandIconComponent={ExpandIconComponent}

            onChange={handleNodeChange}
          />
        )
      })}
    </div>
  );
};