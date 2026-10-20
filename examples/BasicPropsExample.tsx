import TreeSelect from '@attebyte/react-tree-select';
import { exampleDataWithDisabled, ExampleNode } from './data';

// defaultExpanded: all nodes start expanded
// chainedSelect={false}: each node is selected individually
// expandDisabledNodes={false}: disabled nodes can't be expanded or collapsed
export default function BasicPropsExample() {
  return (
    <TreeSelect<ExampleNode>
      defaultData={exampleDataWithDisabled}
      uniqueIDProperty='value'
      labelProperty='label'
      childrenProperty='children'
      valueProperty='included'
      disabledProperty='disabled'

      defaultExpanded
      chainedSelect={false}
      expandDisabledNodes={false}

      className='bg-neutral-800 text-white p-6 rounded font-sans'
      aria-label='Basic props example'
    />
  );
}
