import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../utils/ClassUtility';
import { ExpandIconProps } from './ExpandIcon';
import { StandardComponentProps } from './TreeSelect';

interface Props<T> {
    standardComponentProps: StandardComponentProps<T>;
    label: string;
    hasChildren: boolean;
    expanded?: boolean;
    expandDisabledNodes?: boolean;

    iconClassName?: string;
    iconStyle?: React.CSSProperties;

    ExpandIconComponent: React.ComponentType<ExpandIconProps<T>>;
}

// The tree item itself takes focus; the focus ring is drawn on its label so it outlines one row, not the whole subtree
const labelVariants = cva(`
    rts:ps-3 rts:rounded-xs rts:hover:cursor-pointer rts:hover:opacity-75
    rts:[:focus-visible>&]:outline rts:[:focus-visible>&]:outline-2 rts:[:focus-visible>&]:outline-offset-2
`, {
    variants: {
        disabled: {
            true: "rts:opacity-60 rts:hover:cursor-default rts:hover:opacity-60"
        },
        expandEnabled: {
            true: "rts:hover:opacity-100 rts:hover:cursor-pointer"
        }
    }
});

export interface NodeLabelProps<T> extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof labelVariants>, Props<T> {}

const NodeLabel = <T,>(props: NodeLabelProps<T>) => {

    const {
        standardComponentProps,
        label,
        disabled,
        expandEnabled,
        expandDisabledNodes,
        hasChildren,
        expanded,
        iconClassName,
        iconStyle,
        ExpandIconComponent,
        ...rest
    } = props;

    return (
        <span
            {...rest}
            className={cn(labelVariants({ disabled, expandEnabled: expandEnabled ?? (expandDisabledNodes && hasChildren) }), props.className)}
        >
            {label}
            <ExpandIconComponent standardComponentProps={standardComponentProps} show={hasChildren} expanded={expanded === true} className={iconClassName} style={iconStyle} />
        </span>
    );
};

const MemoNodeLabel = React.memo(NodeLabel) as typeof NodeLabel;

export default MemoNodeLabel;
