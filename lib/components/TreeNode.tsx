import React, { useState } from 'react';
import { NodeCheckProps } from './NodeCheck';
import { NodeLabelProps } from './NodeLabel';
import { ExpandIconProps } from './ExpandIcon';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../utils/ClassUtility';
import { StandardComponentProps } from './TreeSelect';

interface Props<T> {
  standardComponentProps: StandardComponentProps<T>;

  disabled?: boolean;
  level?: number;
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

  onChange: (node: T, value: boolean | null) => void;
}

const nodeVariants = cva("", {
  variants: {
      nested: {
          true: "ps-3"
      }
  }
});

export interface TreeNodeProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>,'onChange'>, VariantProps<typeof nodeVariants>, Props<T> {}

const TreeNode = <T,>(props: TreeNodeProps<T>) => {
  const {
    CheckComponent,
    LabelComponent,
    ExpandIconComponent,
    standardComponentProps: {
      node,
      uniqueIDProperty,
      labelProperty,
      valueProperty,
      childrenProperty,
      disabledProperty
    },
    disabled,
    level,
    defaultExpanded,
    expandDisabledNodes,
    chainedSelect,
    labelClassName,
    labelStyle,
    iconClassName,
    iconStyle,
    inputClassName,
    inputStyle,
    onChange,
    ...rest
  } = props;

  const [expanded, setExpanded] = useState<boolean>(props.defaultExpanded ?? false);

  const isDisabled = props.disabled || (disabledProperty && node[disabledProperty] === true);
  const hasChildren = node[childrenProperty] && Array.isArray(node[childrenProperty]) && (node[childrenProperty] as T[]).length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(node, e.target.checked);
  }

  const handleLabelClick = () => {
    if ((props.expandDisabledNodes || !isDisabled) && node[childrenProperty] && Array.isArray(node[childrenProperty]) && (node[childrenProperty] as T[]).length > 0) {
      setExpanded(!expanded);
    } else if (!isDisabled) {
      onChange(node, !node[valueProperty!]);
    }
  }

  return (
    <div
      {...rest}
      className={cn(nodeVariants({ nested: (props.level && props.level > 0) === true }), props.className)}
    >
      <CheckComponent
        standardComponentProps={props.standardComponentProps}

        className={props.inputClassName}
        style={props.inputStyle}
        disabled={isDisabled}
        expanded={expanded}
        checked={node[valueProperty!] as boolean | null | undefined}

        onChange={handleChange}
      />
      <LabelComponent
        standardComponentProps={props.standardComponentProps}

        label={node[labelProperty] as string}
        expandDisabledNodes={props.expandDisabledNodes}
        disabled={isDisabled}
        hasChildren={hasChildren}
        expanded={expanded}

        className={props.labelClassName}
        style={props.labelStyle}
        iconClassName={props.iconClassName}
        iconStyle={props.iconStyle}

        ExpandIconComponent={ExpandIconComponent}

        onClick={handleLabelClick}
      />
      {hasChildren && expanded && (node[childrenProperty] as T[]).map((child, index) => (
        <TreeNode
          key={`${node[uniqueIDProperty]}-${index}`}
          {...props}
          standardComponentProps={{ ...props.standardComponentProps, node: child }}
          disabled={props.disabled || (props.chainedSelect && isDisabled)}
          level={(props.level ?? 0) + 1}
        />
      ))}
    </div>
  );
};

export default React.memo(TreeNode) as typeof TreeNode;