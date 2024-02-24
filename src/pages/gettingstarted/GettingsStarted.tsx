import React, { useState } from 'react';
import TreeSelect from '../../../lib/main';
import ExampleData from '../../ExampleData.json';
import ExampleNode from '../../models/ExampleNode';
import Code from '../../shared/Code';
import Tip from '../../shared/Tip';

interface Props extends React.HTMLProps<HTMLDivElement> { }

const AppCode = `import TreeSelect from '@attebyte/react-tree-select';
import '@attebyte/react-tree-select/dist/style.css';
import ExampleData from './ExampleData.json';

interface ExampleNode {
  label: string;
  value: number;
  included?: boolean | null;
  children?: ExampleNode[];
}

const App = () => {

  return (
      <TreeSelect
        defaultData={ExampleData}
        uniqueIDProperty={'value'}
        childrenProperty={'children'}
        labelProperty={'label'}
      />
  )
}

export default App;`;

export const ExampleDataCode = JSON.stringify(ExampleData, null, 2);

const GettingStarted = (props: Props) => {

  const [selectedTab, setSelectedTab] = useState('app');

  return (
    <div {...props}>
      <a href='#gettingstarted' hidden>Getting Started</a>
      <h2 id='getting-started' className='text-2xl font-bold mb-2 underline'>Getting Started</h2>
      <p>
        Import the default export from the package and use it in your component.
      </p>
      <div className='w-full mt-4 bg-neutral-800 rounded-t-lg overflow-hidden flex text-center items-center border-b border-neutral-200'>
        <div onClick={() => setSelectedTab('app')} className={`
          flex-grow bg-neutral-800 p-2
          ${selectedTab === 'app' ? 'bg-neutral-600 font-bold' : 'hover:bg-neutral-700 hover:cursor-pointer'}
        `}>App.tsx</div>
        <div onClick={() => setSelectedTab('data')} className={`
          flex-grow bg-neutral-800 p-2
          ${selectedTab === 'data' ? 'bg-neutral-600 font-bold' : 'hover:bg-neutral-700 hover:cursor-pointer'}
        `}>ExampleData.json</div>
      </div>
      {selectedTab === 'app' &&
        <Code>
          {AppCode}
        </Code>
      }
      {selectedTab === 'data' &&
        <Code>
          {ExampleDataCode}
        </Code>
      }
      <Tip>
        Note the <code>import '@attebyte/react-tree-select/dist/style.css';</code> line. This is required to include the default styles for the component.
      </Tip>
      <h4 className='mb-2'>Result</h4>
      <TreeSelect
        defaultData={ExampleData as ExampleNode[]}
        uniqueIDProperty={'value'}
        childrenProperty={'children'}
        labelProperty={'label'}
        valueProperty={'included'}
        className='font-sans'
      />
    </div>
  )
}

export default GettingStarted;