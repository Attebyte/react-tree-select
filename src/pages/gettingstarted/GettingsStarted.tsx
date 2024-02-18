import React from 'react';

const GettingStarted = () => {
  return (
    <div className="mb-4">
      <a href='#getting-started' hidden>Getting Started</a>
      <h2 className='text-2xl font-bold mb-2 underline'>Getting Started</h2>
      <p>
        Import the default export from the package and use it in your component.
      </p>
      <pre className='bg-neutral-800 p-3 rounded-lg my-6'>
        <code>
          {`import TreeSelect from '@attebyte/react-tree-select';

interface ExampleNode {
  label: string;
  value: number;
  included?: boolean | null;
  children?: ExampleNode[];
}

const App = () => {

  const [data, setData] = useState<ExampleNode[]>(ExampleData as ExampleNode[]);

  return (
      <TreeSelect
        data={data}
        uniqueIDProperty={'value'}
        childrenProperty={'children'}
        labelProperty={'label'}
        valueProperty={'included'}
        onChange={setData}
      />
  )
}

export default App;`}
        </code>
      </pre>
    </div>
  )
}

export default GettingStarted;