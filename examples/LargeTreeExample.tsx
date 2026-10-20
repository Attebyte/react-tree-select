import { useState } from 'react';
import TreeSelect, { getSelectedIDs } from '@attebyte/react-tree-select';
import { ExampleNode, generateTree } from './data';

// 10 roots, 100 children, 1,000 grandchildren and 20,000 leaves: 21,110 nodes.
// Selecting a node only re-renders the nodes whose state changed.
export default function LargeTreeExample() {
  const [data, setData] = useState<ExampleNode[]>(() => generateTree([10, 10, 10, 20]));

  const selectedCount = getSelectedIDs(data, {
    uniqueIDProperty: 'value',
    childrenProperty: 'children',
    valueProperty: 'included',
    mode: 'leaves'
  }).length;

  return (
    <div>
      <p className='mb-2'>Selected leaves: {selectedCount.toLocaleString()}</p>
      <div className='max-h-96 overflow-auto'>
        <TreeSelect<ExampleNode>
          data={data}
          onChange={setData}
          uniqueIDProperty='value'
          labelProperty='label'
          childrenProperty='children'
          valueProperty='included'
          aria-label='Large tree'
        />
      </div>
    </div>
  );
}
