import TreeSelect, { TreeNodeProps } from '@attebyte/react-tree-select';
import { FaUser } from 'react-icons/fa6';
import { Comment, commentData } from './data';

// Spreading treeItemProps makes the node focusable and keyboard navigable, and rendering children
// lets TreeSelect manage expansion and nested nodes
const CommentNode = (props: TreeNodeProps<Comment>) => {
  const { standardComponentProps: { node }, treeItemProps, expanded, onExpandedChange, children } = props;
  const hasChildren = (node.children?.length ?? 0) > 0;

  return (
    <div
      {...treeItemProps}
      className='flex basis-full border-l border-neutral-500 my-3 pl-3 outline-none focus-visible:border-neutral-200'
    >
      {node.imageURL
        ? <img src={node.imageURL} alt='' className='h-10 w-10 rounded-full me-2' />
        : <FaUser aria-hidden className='h-10 w-10 rounded-full me-2' />}
      <div className='pl-3'>
        <span className='font-bold'>{node.name}</span>
        <div className='mt-4'>{node.comment}</div>
        {hasChildren && (
          <div
            onClick={() => onExpandedChange?.(!expanded)}
            className='flex gap-2 transition-all items-center text-neutral-400 hover:cursor-pointer hover:text-neutral-200'
          >
            <hr className='grow border-neutral-500' />
            <span>{expanded ? 'Hide replies' : 'Show replies'}</span>
            <hr className='grow border-neutral-500' />
          </div>
        )}
        {children && <div role='group'>{children}</div>}
      </div>
    </div>
  );
};

export default function CustomNodeExample() {
  return (
    <TreeSelect<Comment>
      defaultData={commentData}
      uniqueIDProperty='value'
      labelProperty='name'
      childrenProperty='children'
      className='bg-neutral-800 text-white p-6 rounded'
      CustomNodeComponent={CommentNode}
      aria-label='Comment thread'
    />
  );
}
