import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../utils/ClassUtility';
import { StandardComponentProps } from './TreeSelect';

interface Props<T> {
    standardComponentProps: StandardComponentProps<T>;
    expanded: boolean;
    show: boolean;
}

const iconVariants = cva(`inline-block text-[.8em] ms-3 transition-transform duration-200`, {
    variants: {
        rotated: {
            true: "rotate-180"
        }
    }
});

export interface ExpandIconProps<T> extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof iconVariants>, Props<T> { }

const ExpandIcon = <T,>(props: ExpandIconProps<T>) => {
    const {
        standardComponentProps,
        expanded,
        show,
        ...rest
    } = props;

    if (!props.show)
        return null;

    return (
        <span
            {...rest}
            className={cn(iconVariants({ rotated: props.expanded === true }), props.className)}
        >
            &#x25B2;
        </span>
    );
};

export default React.memo(ExpandIcon) as typeof ExpandIcon;