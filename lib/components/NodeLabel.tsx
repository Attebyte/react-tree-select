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

const labelVariants = cva("ps-3 hover:cursor-pointer hover:opacity-75", {
    variants: {
        disabled: {
            true: "opacity-60 hover:cursor-default hover:opacity-60"
        },
        expandEnabled: {
            true: "hover:opacity-100 hover:cursor-pointer"
        }
    }
});

export interface NodeLabelProps<T> extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof labelVariants>, Props<T> {}

const NodeLabel = <T,>(props: NodeLabelProps<T>) => {

    const {
        standardComponentProps,
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
            role='button'
            {...rest}
            className={cn(labelVariants({ disabled: props.disabled, expandEnabled: props.expandDisabledNodes && props.hasChildren }), props.className)}
        >
            {props.label}
            <ExpandIconComponent standardComponentProps={props.standardComponentProps} show={props.hasChildren} expanded={props.expanded === true} className={iconClassName} style={iconStyle} />
        </span>
    );
};

export default React.memo(NodeLabel) as typeof NodeLabel;