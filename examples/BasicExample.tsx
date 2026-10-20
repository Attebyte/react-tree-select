import TreeSelect from '@attebyte/react-tree-select';
import { exampleData, ExampleNode } from './data';

export default function BasicExample() {
  return (
    <TreeSelect<ExampleNode>
      defaultData={exampleData}
      uniqueIDProperty='value'
      labelProperty='label'
      childrenProperty='children'
      valueProperty='included'
      aria-label='Basic example'
    />
  );
}
