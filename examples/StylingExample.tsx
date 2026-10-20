import TreeSelect from '@attebyte/react-tree-select';
import { exampleData, ExampleNode } from './data';

// Class names are merged with the defaults by tailwind-merge, so they override conflicting defaults
export default function StylingExample() {
  return (
    <TreeSelect<ExampleNode>
      defaultData={exampleData}
      uniqueIDProperty='value'
      labelProperty='label'
      childrenProperty='children'
      valueProperty='included'

      className='bg-neutral-800 text-white p-6 rounded font-sans'
      inputClassName='checked:text-blue-500 text-orange-600 h-8 w-8 after:text-2xl'
      labelClassName='font-bold text-4xl'
      iconClassName='text-neutral-500'
      aria-label='Styling example'
    />
  );
}
