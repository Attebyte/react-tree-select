import React from 'react';

interface Props extends React.HTMLProps<HTMLDivElement> { }

const Installation = (props: Props) => {
  return (
    <div {...props}>
      <a href='#installation' hidden>Installation</a>
      <h2 className='text-2xl font-bold mb-2 underline'>Installation</h2>
      <p>
        To install the package, simply use your favorite package manager.
      </p>
      <pre className='bg-neutral-800 p-3 rounded-lg my-6'>
        <code>
          npm install @attebyte/react-tree-select
        </code>
      </pre>
      <pre className='bg-neutral-800 p-3 rounded-lg my-6'>
        <code>
          yarn add @attebyte/react-tree-select
        </code>
      </pre>
    </div>
  )
}

export default Installation;