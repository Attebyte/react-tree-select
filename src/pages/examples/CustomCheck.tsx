import ExampleData from '../../ExampleData.json';
import TreeSelect, { NodeCheckProps } from '../../../lib/main';
import { FaFolderOpen, FaFolder, FaFile } from 'react-icons/fa6';
import ExampleNode from '../../models/ExampleNode';
import SourceLinkButton from '../../shared/SourceLinkButton';

const CustomFolderIcon = (props: NodeCheckProps<ExampleNode>) => {
  const hasChildren = Array.isArray(props.standardComponentProps.node[props.standardComponentProps.childrenProperty]) &&
    (props.standardComponentProps.node[props.standardComponentProps.childrenProperty] as ExampleNode[])?.length > 0;

  if (hasChildren && props.expanded)
    return <FaFolderOpen className={`h-5 w-5 ${props.disabled ? 'opacity-60' : ''} ${props.checked === null ? 'text-orange-600' : props.checked ? 'text-blue-500' : ''}`} />

  if (hasChildren)
    return <FaFolder className={`h-5 w-5 ${props.disabled ? 'opacity-60' : ''} ${props.checked === null ? 'text-orange-600' : props.checked ? 'text-blue-500' : ''}`} />

  return <FaFile className={`h-5 w-5 ${props.disabled ? 'opacity-60' : ''} ${props.checked ? 'text-blue-500' : ''}`} />
}


const CustomCheck = () => {
  return (
    <div className='relative'>
      <SourceLinkButton href='https://github.com/Attebyte/react-tree-select/blob/main/src/pages/examples/CustomCheck.tsx' />
      <TreeSelect
        defaultData={ExampleData}
        uniqueIDProperty={'value'}
        childrenProperty={'children'}
        labelProperty={'label'}
        valueProperty={'included'}

        className='bg-neutral-800 text-white p-6 rounded'
        nodeClassName='flex flex-wrap basis-full'
        labelClassName='font-bold font-mono'

        CustomCheckComponent={CustomFolderIcon}
        CustomExpandIconComponent={() => null}
      />
    </div>
  )
}

export default CustomCheck;
