import TreeSelect from '@attebyte/react-tree-select';
import { exampleDataWithDisabled, ExampleNode } from './data';

// With chained selection, checking 'Root 1' skips the disabled 'Child 1' branch, so 'Root 1' shows as
// mixed. Checking it again unchecks everything that can be changed.
export default function DisabledNodesExample() {
  return (
    <TreeSelect<ExampleNode>
      defaultData={exampleDataWithDisabled}
      uniqueIDProperty='value'
      labelProperty='label'
      childrenProperty='children'
      valueProperty='included'
      disabledProperty='disabled'
      defaultExpanded
      className='bg-neutral-800 text-white p-6 rounded font-sans'
      aria-label='Disabled nodes example'
    />
  );
}
