import { VariantProps, cva } from 'class-variance-authority';
import React, { useCallback, useRef, useState } from 'react';
import { cn } from '../utils/ClassUtility';
import { assignRef } from '../utils/assignRef';
import { useIsomorphicLayoutEffect } from '../utils/useIsomorphicLayoutEffect';
import { StandardComponentProps } from './TreeSelect';

interface Props<T> {
    myRef?: React.Ref<HTMLInputElement>;
    standardComponentProps: StandardComponentProps<T>;
    checked?: boolean | null;
    expanded?: boolean;
    disabled?: boolean;
}

// font:inherit sizes the 1em box from the surrounding text rather than the browser's control font
const checkVariants = cva(`
    rts:appearance-none rts:box-border rts:m-0 rts:[font:inherit] rts:inline-block rts:align-text-bottom rts:text-current rts:relative rts:cursor-pointer
    rts:w-[1em] rts:h-[1em] rts:border rts:border-solid rts:border-current rts:rounded-xs
    rts:checked:after:content-["✓"] rts:after:text-sm rts:after:font-bold rts:after:flex rts:after:justify-center rts:after:align-middle rts:after:-m-[.2rem]
    rts:disabled:cursor-default rts:disabled:bg-gray-300 rts:disabled:border-gray-300 rts:disabled:text-gray-500
`, {
    variants: {
        mixed: {
            true: "rts:after:content-['■']"
        }
    }
});

export interface NodeCheckProps<T> extends React.HTMLAttributes<HTMLInputElement>, VariantProps<typeof checkVariants>, Props<T> { }

const NodeCheck = <T,>(props: NodeCheckProps<T>) => {
    const {
        myRef,
        standardComponentProps,
        checked,
        expanded,
        mixed,
        onMouseDown,
        ...rest
    } = props;

    const inputRef = useRef<HTMLInputElement | null>(null);

    // Inside a tree item, the item carries the checked state and takes focus, so the input is hidden from
    // assistive tech and the tab order. A custom node without treeItemProps keeps a normal, labelled checkbox.
    const [inTreeItem, setInTreeItem] = useState(true);

    const setRef = useCallback((input: HTMLInputElement | null) => {
        inputRef.current = input;
        assignRef(myRef, input);
    }, [myRef]);

    useIsomorphicLayoutEffect(() => {
        setInTreeItem(inputRef.current?.closest('[role="treeitem"]') != null);
    }, []);

    useIsomorphicLayoutEffect(() => {
        if (inputRef.current)
            inputRef.current.indeterminate = checked === null;
    }, [checked]);

    const handleMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
        onMouseDown?.(e);
        const treeItem = e.currentTarget.closest<HTMLElement>('[role="treeitem"]');
        if (e.defaultPrevented || !treeItem)
            return;

        e.preventDefault();
        treeItem.focus();
    };

    const { node, labelProperty } = standardComponentProps;
    const label = node[labelProperty];

    return (
        <input
            ref={setRef}
            tabIndex={inTreeItem ? -1 : undefined}
            aria-hidden={inTreeItem || undefined}
            aria-label={!inTreeItem && label != null ? String(label) : undefined}
            {...rest}
            checked={checked === true}
            className={cn(checkVariants({ mixed: mixed ?? checked === null }), props.className)}
            type='checkbox'
            onMouseDown={handleMouseDown}
        />
    );
};

const MemoNodeCheck = React.memo(NodeCheck) as typeof NodeCheck;

export default MemoNodeCheck;
