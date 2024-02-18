import React, { useState } from 'react';
import { FaFile, FaFolder, FaFolderOpen } from 'react-icons/fa6';
import { NodeCheckProps } from '../lib/components/NodeCheck';
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './layout/Layout';
import Installation from './pages/installation/Installation';
import GettingStarted from './pages/gettingstarted/GettingsStarted';
import API from './pages/api/API';
// import ExampleData from './ExampleData.json';

interface ExampleNode {
  label: string;
  value: number;
  included?: boolean | null;
  children?: ExampleNode[];
}

const ExampleData: ExampleNode[] = [
  {
    label: 'Root 1',
    value: 1,
    children: [
      {
        label: 'Child 1',
        value: 2,
        children: [
          {
            label: 'Grandchild 1',
            value: 3,
          },
          {
            label: 'Grandchild 2',
            value: 4,
          }
        ]
      },
      {
        label: 'Child 2',
        value: 5,
      }
    ]
  },
  {
    label: 'Root 2',
    value: 6,
    children: [
      {
        label: 'Child 3',
        value: 7,
      },
      {
        label: 'Child 4',
        value: 8,
      }
    ]
  }

];

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
    <Layout>
      <div className='flex flex-col gap-10 overflow-hidden'>
        <Installation />
        <GettingStarted />
        <API />
      </div>
    </Layout>
  )
}

export default App
