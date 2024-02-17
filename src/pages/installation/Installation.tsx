import React from 'react';

interface Props {

}

const Installation = (props: React.PropsWithChildren<Props>) => {
  return (
    <div className="mb-4">
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