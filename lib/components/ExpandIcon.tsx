import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../utils/ClassUtility';
import { StandardComponentProps } from './TreeSelect';

interface Props<T> {
    standardComponentProps: StandardComponentProps<T>;
    expanded: boolean;
    show: boolean;
}

const iconVariants = cva(`rts:inline-block rts:text-[.8em] rts:ms-3 rts:transition-transform rts:duration-200`, {
    variants: {
        rotated: {
            true: "rts:rotate-180"
        }
    }
});

export interface ExpandIconProps<T> extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof iconVariants>, Props<T> { }

const ExpandIcon = <T,>(props: ExpandIconProps<T>) => {
    const {
        standardComponentProps,
        expanded,
        show,
        rotated,
        ...rest
    } = props;

    if (!show)
        return null;

    // Decorative: the tree item exposes the expanded state through aria-expanded
    return (
        <span
            aria-hidden={true}
            {...rest}
            className={cn(iconVariants({ rotated: rotated ?? expanded === true }), props.className)}
        >
            &#x25B2;
        </span>
    );
};

const MemoExpandIcon = React.memo(ExpandIcon) as typeof ExpandIcon;

export default MemoExpandIcon;
