import React, { useState } from 'react';
import TreeSelect from '../../../lib/main';
import ExampleData from '../../ExampleData.json';
import Code from '../../shared/Code';

interface Props extends React.HTMLProps<HTMLDivElement> { }

interface ExampleNode {
  label: string;
  value: number;
  included?: boolean | null;
  children?: ExampleNode[];
}

const AppCode = `import TreeSelect from '@attebyte/react-tree-select';
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

const ExampleDataCode = JSON.stringify(ExampleData, null, 2);

const GettingStarted = (props: Props) => {

  const [selectedTab, setSelectedTab] = useState('app');

  return (
    <div {...props}>
      <a href='#getting-started' hidden>Getting Started</a>
      <h2 className='text-2xl font-bold mb-2 underline'>Getting Started</h2>
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
        <Code className='bg-neutral-800 p-3 rounded-b-lg mb-6'>
          {AppCode}
        </Code>
      }
      {selectedTab === 'data' &&
        <Code className='bg-neutral-800 p-3 rounded-b-lg mb-6'>
          {ExampleDataCode}
        </Code>
      }
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