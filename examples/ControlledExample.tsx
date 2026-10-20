import { useState } from 'react';
import TreeSelect, { getSelectedIDs, SelectionMode } from '@attebyte/react-tree-select';
import { exampleData, ExampleNode } from './data';

export default function ControlledExample() {
  const [data, setData] = useState(exampleData);
  const [mode, setMode] = useState<SelectionMode>('leaves');

  const selectedIDs = getSelectedIDs(data, {
    uniqueIDProperty: 'value',
    childrenProperty: 'children',
    valueProperty: 'included',
    mode
  });

  return (
    <div className='flex flex-wrap gap-6'>
      <TreeSelect<ExampleNode>
        data={data}
        onChange={setData}
        uniqueIDProperty='value'
        labelProperty='label'
        childrenProperty='children'
        valueProperty='included'
        defaultExpanded
        aria-label='Controlled example'
      />
      <div className='min-w-48'>
        <label className='block mb-2'>
          Mode{' '}
          <select value={mode} onChange={e => setMode(e.target.value as SelectionMode)} className='text-black rounded px-1'>
            <option value='all'>all</option>
            <option value='leaves'>leaves</option>
            <option value='topmost'>topmost</option>
          </select>
        </label>
        <div>
          Selected IDs: <code data-testid='selected-ids'>{JSON.stringify(selectedIDs)}</code>
        </div>
        <button className='mt-3 border rounded px-2 py-1' onClick={() => setData(exampleData)}>
          Reset
        </button>
      </div>
    </div>
  );
}
