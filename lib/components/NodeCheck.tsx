import { VariantProps, cva } from 'class-variance-authority';
import React from 'react';
import { cn } from '../utils/ClassUtility';
import { StandardComponentProps } from './TreeSelect';

interface Props<T> {
    myRef?: React.RefObject<HTMLInputElement>;
    standardComponentProps: StandardComponentProps<T>;
    checked?: boolean | null;
    expanded?: boolean;
    disabled?: boolean;
}

const checkVariants = cva(`
    appearance-none inline-block align-text-bottom text-current relative cursor-pointer
    w-[1em] h-[1em] border border-current rounded-sm
    checked:after:content-["✓"] after:text-sm after:font-bold after:flex after:justify-center after:align-middle after:-m-[.2rem]
    disabled:cursor-default disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-500
`, {
    variants: {
        mixed: {
            true: "after:content-['■']"
        }
    }
});

export interface NodeCheckProps<T> extends React.HTMLAttributes<HTMLInputElement>, VariantProps<typeof checkVariants>, Props<T> { }

const NodeCheck = <T,>(props: NodeCheckProps<T>) => {
    const {
        myRef,
        standardComponentProps,
        checked,
        ...rest
    } = props;

    return (
        <input
            ref={myRef}
            {...rest}
            checked={props.checked === true}
            className={cn(checkVariants({ mixed: props.checked === null }), props.className)}
            type='checkbox'
        />
    );
};

export default React.memo(NodeCheck) as typeof NodeCheck;