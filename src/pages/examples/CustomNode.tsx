import { useState } from 'react';
import { FaUser } from 'react-icons/fa6';
import TreeSelect, { NodeCheckProps, TreeNodeProps } from '../../../lib/main';
import SourceLinkButton from '../../shared/SourceLinkButton';


const CustomAvatar = (props: NodeCheckProps<typeof ExampleData[number]>) => {
  if (props.standardComponentProps.node?.imageURL)
    return <img src={props.standardComponentProps.node.imageURL} alt={props.standardComponentProps.node.name} className='h-10 w-10 rounded-full me-2' />

  return <FaUser className='h-10 w-10 rounded-full me-2' />
}

const CustomNodeComponent = (props: TreeNodeProps<typeof ExampleData[number]>) => {
  const {
    standardComponentProps: {
      node
    },
    level
  } = props;

  const [expanded, setExpanded] = useState<boolean>(props.defaultExpanded ?? false);

  const hasChildren = node.children && Array.isArray(node.children) && node.children.length > 0;

  return (
    <div className='flex flex-wrap basis-full border-l border-neutral-500 my-3 pl-3'>
      <CustomAvatar
        standardComponentProps={props.standardComponentProps}
      />
      <div className='pl-3'>
        <span className='font-bold'>{props.standardComponentProps.node.name}</span>
        <div className='mt-4'>
          {props.standardComponentProps.node.comment}
        </div>
        {hasChildren &&
          <div
            onClick={() => setExpanded(!expanded)}
            className={`
              flex gap-2 transition-all items-center w-100 text-neutral-500
              hover:cursor-pointer hover:text-neutral-300
            `}
          >
            <hr className='flex-grow border-neutral-500' />
            <span className=''>{expanded ? 'Hide Replies' : 'Show Replies'}</span>
            <hr className='flex-grow border-neutral-500' />
          </div>
        }
        {hasChildren && expanded && node.children.map((child, index) => (
          <CustomNodeComponent
            key={`${node.value}-${index}`}
            {...props}
            standardComponentProps={{ ...props.standardComponentProps, node: child }}
            level={(level ?? 0) + 1}
          />
        ))}
      </div>
    </div>
  );
}


const CustomNode = () => {
  return (
    <div className='relative'>
      <SourceLinkButton href='https://github.com/Attebyte/react-tree-select/blob/main/src/pages/examples/CustomNode.tsx' />
      <TreeSelect
        defaultData={ExampleData}
        uniqueIDProperty={'value'}
        childrenProperty={'children'}
        labelProperty={'name'}

        className='bg-neutral-800 text-white p-6 rounded'

        CustomNodeComponent={CustomNodeComponent}
      />
    </div>

  )
}

export default CustomNode;



const ExampleData = [
  {
    name: 'John Doe',
    value: 1,
    imageURL: 'https://firebasestorage.googleapis.com/v0/b/attebyte-8542f.appspot.com/o/react-tree-select%2Fheadshot1.png?alt=media&token=a272c183-47af-44b6-8be0-05dfaac7bc0d',
    comment: 'Wow, this is a great post!',
    children: [
      {
        name: 'Jane Doe',
        value: 2,
        imageURL: '',
        comment: 'I agree, this is a great post!',
        children: [
          {
            name: 'John Doe',
            value: 3,
            imageURL: 'https://firebasestorage.googleapis.com/v0/b/attebyte-8542f.appspot.com/o/react-tree-select%2Fheadshot1.png?alt=media&token=a272c183-47af-44b6-8be0-05dfaac7bc0d',
            comment: 'Thanks, I appreciate the feedback!'
          }
        ]
      }
    ]
  },
  {
    name: 'Andrew Smith',
    value: 4,
    comment: 'I disagree, this is a terrible post!',
    imageURL: 'https://firebasestorage.googleapis.com/v0/b/attebyte-8542f.appspot.com/o/react-tree-select%2Fheadshot2.png?alt=media&token=3d08ea5d-a216-4ca3-ab0d-aa2d1d66cf4b',
    children: [
      {
        name: 'John Doe',
        value: 5,
        imageURL: 'https://firebasestorage.googleapis.com/v0/b/attebyte-8542f.appspot.com/o/react-tree-select%2Fheadshot1.png?alt=media&token=a272c183-47af-44b6-8be0-05dfaac7bc0d',
        comment: 'I appreciate the feedback, but I disagree!'
      }
    ]
  },
  {
    name: 'Jane Smith',
    value: 6,
    imageURL: 'https://firebasestorage.googleapis.com/v0/b/attebyte-8542f.appspot.com/o/react-tree-select%2Fheadshot3.png?alt=media&token=7519573c-5550-44b0-932f-0378a3eae146',
    comment: 'My opinion matters more than yours!'
  }
];