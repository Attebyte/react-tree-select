import React, { useEffect, useState } from 'react';
import { FaFile, FaFolder, FaFolderOpen } from 'react-icons/fa6';
import { NodeCheckProps } from '../lib/components/NodeCheck';
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './layout/Layout';
import Installation from './pages/installation/Installation';
import GettingStarted from './pages/gettingstarted/GettingsStarted';
import API from './pages/api/API';
import Examples from './pages/examples/Examples';
import About from './pages/about/About';

// const CustomFolderIcon = (props: NodeCheckProps<ExampleNode>) => {
//   const hasChildren = Array.isArray(props.standardComponentProps.node[props.standardComponentProps.childrenProperty]) &&
//     (props.standardComponentProps.node[props.standardComponentProps.childrenProperty] as ExampleNode[])?.length > 0;

//   if (hasChildren && props.expanded)
//     return <FaFolderOpen className={`h-5 w-5 ${props.disabled ? 'opacity-60' : ''} ${props.checked === null ? 'text-emerald-600' : props.checked ? 'text-cyan-300' : ''}`} />

//   if (hasChildren)
//     return <FaFolder className={`h-5 w-5 ${props.disabled ? 'opacity-60' : ''} ${props.checked === null ? 'text-emerald-600' : props.checked ? 'text-cyan-300' : ''}`} />

//   return <FaFile className={`h-5 w-5 ${props.disabled ? 'opacity-60' : ''} ${props.checked ? 'text-cyan-300' : ''}`} />
// }

const App = () => {

  useEffect(() => {
    const installationAnchor = Array.from(document.getElementsByTagName('a')).find(a => a.hash === '#installation');
    const gettingStartedAnchor = Array.from(document.getElementsByTagName('a')).find(a => a.hash === '#gettingstarted');
    const apiAnchor = Array.from(document.getElementsByTagName('a')).find(a => a.hash === '#api');
    const examplesAnchor = Array.from(document.getElementsByTagName('a')).find(a => a.hash === '#examples');

    if (window.location.hash === '') {
      window.location.hash = 'installation';
    }

    const scrollElement = document.getElementById('scroll');
    if (scrollElement) {
      scrollElement.addEventListener('scroll', () => {
        if (installationAnchor && gettingStartedAnchor && apiAnchor && examplesAnchor) {
          console.log(gettingStartedAnchor.scrollHeight);
        }
      });
    }
  }, []);



  return (
    <Layout>
      <div className='flex flex-col gap-10 overflow-hidden'>
        <About />
        <Installation />
        <GettingStarted />
        <API />
        <Examples />
      </div>
    </Layout>
  )
}

export default App
