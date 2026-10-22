import React from 'react';
import { NodeCheckProps } from './NodeCheck';
import { NodeLabelProps } from './NodeLabel';
import { ExpandIconProps } from './ExpandIcon';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../utils/ClassUtility';
import { getChildren } from '../utils/TreeUtility';
import { NodeChangeOptions, StandardComponentProps } from './TreeSelect';

// Accessibility attributes (role, tabIndex, aria-*) and the focus ref for a node.
// Spread onto the node's root element to take part in keyboard navigation.
export interface TreeItemAttributes extends React.HTMLAttributes<HTMLElement> {
  ref: React.RefCallback<HTMLElement>;
}

interface Props<T> {
  standardComponentProps: StandardComponentProps<T>;
  treeItemProps?: TreeItemAttributes;

  disabled?: boolean;
  level?: number;
  expanded?: boolean;
  defaultExpanded?: boolean;
  expandDisabledNodes?: boolean;
  chainedSelect?: boolean;

  labelClassName?: string;
  labelStyle?: React.CSSProperties;
  iconClassName?: string;
  iconStyle?: React.CSSProperties;
  inputClassName?: string;
  inputStyle?: React.CSSProperties;

  CheckComponent: React.ComponentType<NodeCheckProps<T>>;
  LabelComponent: React.ComponentType<NodeLabelProps<T>>;
  ExpandIconComponent: React.ComponentType<ExpandIconProps<T>>;

  onChange: (node: T, value: boolean | null, options?: NodeChangeOptions) => void;
  onExpandedChange?: (expanded: boolean) => void;
}

const nodeVariants = cva("rts:outline-hidden", {
  variants: {
      nested: {
          true: "rts:ps-3"
      }
  }
});

export interface TreeNodeProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>,'onChange'>, VariantProps<typeof nodeVariants>, Props<T> {}

const TreeNode = <T,>(props: TreeNodeProps<T>) => {
  const {
    CheckComponent,
    LabelComponent,
    ExpandIconComponent,
    standardComponentProps,
    treeItemProps,
    disabled,
    level,
    expanded = false,
    defaultExpanded,
    expandDisabledNodes,
    chainedSelect,
    nested,
    labelClassName,
    labelStyle,
    iconClassName,
    iconStyle,
    inputClassName,
    inputStyle,
    onChange,
    onExpandedChange,
    children,
    className,
    ...rest
  } = props;

  const { node, labelProperty, valueProperty, childrenProperty, disabledProperty } = standardComponentProps;

  const isDisabled = disabled || (disabledProperty !== undefined && node[disabledProperty] === true);
  const hasChildren = getChildren(node, childrenProperty).length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(node, e.target.checked, { toggle: true });
  }

  const handleLabelClick = () => {
    if ((expandDisabledNodes || !isDisabled) && hasChildren) {
      onExpandedChange?.(!expanded);
    } else if (!isDisabled && valueProperty !== undefined) {
      onChange(node, node[valueProperty] !== true, { toggle: true });
    }
  }

  return (
    <div
      {...treeItemProps}
      {...rest}
      className={cn(nodeVariants({ nested: nested ?? (level ?? 0) > 0 }), className)}
    >
      <CheckComponent
        standardComponentProps={standardComponentProps}

        className={inputClassName}
        style={inputStyle}
        disabled={isDisabled}
        expanded={expanded}
        checked={valueProperty !== undefined ? node[valueProperty] as boolean | null | undefined : undefined}

        onChange={handleChange}
      />
      <LabelComponent
        standardComponentProps={standardComponentProps}

        label={node[labelProperty] as string}
        expandDisabledNodes={expandDisabledNodes}
        disabled={isDisabled}
        hasChildren={hasChildren}
        expanded={expanded}

        className={labelClassName}
        style={labelStyle}
        iconClassName={iconClassName}
        iconStyle={iconStyle}

        ExpandIconComponent={ExpandIconComponent}

        onClick={handleLabelClick}
      />
      {children && (
        <div role='group' className='rts:basis-full'>
          {children}
        </div>
      )}
    </div>
  );
};

const MemoTreeNode = React.memo(TreeNode) as typeof TreeNode;

export default MemoTreeNode;
