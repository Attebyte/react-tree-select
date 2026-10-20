import TreeSelect, { NodeCheckProps } from '@attebyte/react-tree-select';
import { FaFile, FaFolder, FaFolderOpen } from 'react-icons/fa6';
import { exampleData, ExampleNode } from './data';

// Replaces the checkbox with folder and file icons; clicking a file's name selects it
const FolderIcon = (props: NodeCheckProps<ExampleNode>) => {
  const { node } = props.standardComponentProps;
  const hasChildren = (node.children?.length ?? 0) > 0;
  const color = props.checked === null ? 'text-orange-600' : props.checked ? 'text-blue-500' : '';
  const className = `h-5 w-5 ${props.disabled ? 'opacity-60' : ''} ${color}`;

  if (hasChildren && props.expanded)
    return <FaFolderOpen aria-hidden className={className} />;
  if (hasChildren)
    return <FaFolder aria-hidden className={className} />;
  return <FaFile aria-hidden className={className} />;
};

const NoIcon = () => null;

export default function CustomCheckExample() {
  return (
    <TreeSelect<ExampleNode>
      defaultData={exampleData}
      uniqueIDProperty='value'
      labelProperty='label'
      childrenProperty='children'
      valueProperty='included'

      className='bg-neutral-800 text-white p-6 rounded'
      nodeClassName='flex flex-wrap basis-full'
      labelClassName='font-bold font-mono'

      CustomCheckComponent={FolderIcon}
      CustomExpandIconComponent={NoIcon}
      aria-label='Custom check example'
    />
  );
}
