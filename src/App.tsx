import React, { useState } from 'react';
import { FaFile, FaFolder, FaFolderOpen } from 'react-icons/fa6';
import { NodeCheckProps } from '../lib/components/NodeCheck';
import { TreeSelect } from '../lib/main';
import './App.css';
import ExampleData from './ExampleData.json';

interface ExampleNode {
  label: string;
  value: number;
  included?: boolean;
  disabled?: boolean;
  children?: ExampleNode[];
}

const CustomFolderIcon = (props: NodeCheckProps<ExampleNode>) => {
  const hasChildren = Array.isArray(props.standardComponentProps.node[props.standardComponentProps.childrenProperty]) &&
    (props.standardComponentProps.node[props.standardComponentProps.childrenProperty] as ExampleNode[])?.length > 0;

  if (hasChildren && props.expanded)
    return <FaFolderOpen className={`h-5 w-5 ${props.disabled ? 'opacity-60' : ''} ${props.checked === null ? 'text-emerald-600' : props.checked ? 'text-cyan-300' : ''}`} />

  if (hasChildren)
    return <FaFolder className={`h-5 w-5 ${props.disabled ? 'opacity-60' : ''} ${props.checked === null ? 'text-emerald-600' : props.checked ? 'text-cyan-300' : ''}`} />

  return <FaFile className={`h-5 w-5 ${props.disabled ? 'opacity-60' : ''} ${props.checked ? 'text-cyan-300' : ''}`} />
}

const App = () => {

  const [data, setData] = useState<ExampleNode[]>(ExampleData as ExampleNode[]);
  const [chainedSelect, setChainedSelect] = useState<boolean>(true);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [expandDisabled, setExpandDisabled] = useState<boolean>(false);

  const containerRef = React.createRef<HTMLDivElement>();

  const handleChange = (newData: ExampleNode[]) => {
    console.log(containerRef.current);
    setData(newData);
  }

  return (
    <div className='p-3'>
      <div className='flex gap-6'>
        <label>
          <input type='checkbox' onChange={(e) => setChainedSelect(e.target.checked)} checked={chainedSelect} />
          <span className='ps-2'>Chained Select</span>
        </label>

        <label>
          <input type='checkbox' onChange={(e) => setDisabled(e.target.checked)} checked={disabled} />
          <span className='ps-2'>Disabled</span>
        </label>

        <label>
          <input type='checkbox' onChange={(e) => setExpandDisabled(e.target.checked)} checked={expandDisabled} />
          <span className='ps-2'>Expand Disabled</span>
        </label>
      </div>


      <div className='border-t border-gray-600 h-0 my-3' />

      <TreeSelect
        data={data}
        chainedSelect={chainedSelect}
        disabled={disabled}
        expandDisabledNodes={expandDisabled}
        uniqueIDProperty={'value'}
        childrenProperty={'children'}
        labelProperty={'label'}
        valueProperty={'included'}
        disabledProperty={'disabled'}

        // CustomCheckComponent={CustomFolderIcon}
        // CustomExpandIconComponent={() => null}

        // className='bg-sky-950 text-neutral-200 p-6'
        // nodeClassName='flex flex-wrap basis-full'
        // labelClassName='font-bold font-mono'

        onChange={handleChange}
      />
    </div>
  )
}

export default App
