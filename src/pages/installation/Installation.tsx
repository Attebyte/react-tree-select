import React from 'react';
import Code from '../../shared/Code';

interface Props extends React.HTMLProps<HTMLDivElement> { }

const Installation = (props: Props) => {
  return (
    <div {...props}>
      <h2 id='installation' className='text-2xl font-bold mb-2 underline'>Installation</h2>
      <p>
        To install the package, simply use your favorite package manager.
      </p>
      <Code>
        npm install @attebyte/react-tree-select
      </Code>
      <Code>
        yarn add @attebyte/react-tree-select
      </Code>
    </div>
  )
}

export default Installation;