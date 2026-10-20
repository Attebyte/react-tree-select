import TreeSelect, { ExpandIconProps } from '@attebyte/react-tree-select';
import { FaMinus } from 'react-icons/fa6';
import { exampleData, ExampleNode } from './data';

const PlusMinusIcon = (props: ExpandIconProps<ExampleNode>) => {
  if (!props.show)
    return null;

  return (
    <span aria-hidden className='relative align-middle inline-block ml-4 w-5 h-5'>
      <FaMinus className='absolute h-5 w-5' />
      <FaMinus className={`absolute h-5 w-5 transition-all ${props.expanded ? '' : 'rotate-90'}`} />
    </span>
  );
};

export default function CustomIconExample() {
  return (
    <TreeSelect<ExampleNode>
      defaultData={exampleData}
      uniqueIDProperty='value'
      labelProperty='label'
      childrenProperty='children'
      valueProperty='included'
      className='bg-neutral-800 text-white p-6 rounded font-sans'
      CustomExpandIconComponent={PlusMinusIcon}
      aria-label='Custom icon example'
    />
  );
}
