import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import Layout from './layout/Layout';
import About from './pages/about/About';
import API from './pages/api/API';
import Examples from './pages/examples/Examples';
import GettingStarted from './pages/gettingstarted/GettingsStarted';
import Installation from './pages/installation/Installation';

const App = () => {
  const [currentHash, setCurrentHash] = useState('');

  const installationRef = useRef<HTMLElement | null>(null);
  const gettingStartedRef = useRef<HTMLElement | null>(null);
  const apiRef = useRef<HTMLElement | null>(null);
  const examplesRef = useRef<HTMLElement | null>(null);


  const setHash = (hash: string) => {
    const url = new URL(window.location.href);
    url.hash = hash;
    window.history.pushState({}, '', url);
    setCurrentHash(hash);
  }

  useEffect(() => {
    installationRef.current = document.getElementById('installation');
    gettingStartedRef.current = document.getElementById('getting-started');
    apiRef.current = document.getElementById('api');
    examplesRef.current = document.getElementById('examples');

    if (window.location.hash) {
      setCurrentHash(window.location.hash.replace('#', ''));
      const element = document.getElementById(window.location.hash.replace('#', ''));
      if (element) {
        element.scrollIntoView();
      }
    }

    const scrollElement = document.getElementById('scroll');
    if (scrollElement) {
      scrollElement.addEventListener('scroll', () => {
        if (installationRef.current && gettingStartedRef.current && apiRef.current && examplesRef.current) {
          // If scrollElement.scrollTop is greater than the top of the element
          // set the hash to the id of the element
          // Do not set the hash if the element is already the hash
          if (scrollElement.scrollTop < installationRef.current.offsetTop && window.location.hash !== '#installation') {
            setHash('installation');
          }
          if (scrollElement.scrollTop > installationRef.current.offsetTop && scrollElement.scrollTop < gettingStartedRef.current.offsetTop && window.location.hash !== '#installation') {
            setHash('installation');
          }
          if (scrollElement.scrollTop > gettingStartedRef.current.offsetTop && scrollElement.scrollTop < apiRef.current.offsetTop && window.location.hash !== '#getting-started') {
            setHash('getting-started');
          }
          if (scrollElement.scrollTop > apiRef.current.offsetTop && scrollElement.scrollTop < examplesRef.current.offsetTop && window.location.hash !== '#api') {
            setHash('api');
          }
          if (scrollElement.scrollTop > examplesRef.current.offsetTop && window.location.hash !== '#examples') {
            setHash('examples');
          }

        }
      });
    }
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setHash(e.currentTarget.hash.replace('#', ''));

    // manually scroll to the element
    const element = document.getElementById(e.currentTarget.hash.replace('#', ''));
    if (element) {
      element.scrollIntoView();
    }
  }

  return (
    <Layout onLinkClick={handleLinkClick} currentHash={currentHash}>
      <div className='flex flex-col gap-10 overflow-hidden mb-32'>
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
