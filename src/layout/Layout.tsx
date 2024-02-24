import { useState } from "react";
import { FaBars, FaGithub, FaXTwitter } from "react-icons/fa6";
import SideItem from "./SideItem";


interface Props {
  currentHash: string;
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const Layout = (props: React.PropsWithChildren<Props>) => {

  const [expanded, setExpanded] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    props.onLinkClick && props.onLinkClick(e);
  }

  return (
    <div className="h-full w-full flex flex-column overflow-hidden bg-slate-800 text-white">
      <div className="max-w-full basis-full flex mx-auto ">
        <div className="flex basis-full grow-1 shrink-0 flex-col lg:flex-row overflow-hidden">
          <div className="lg:basis-72 flex flex-col shrink-0 p-2 shadow-lg lg:shadow-none">
            <div className="flex flex-row justify-between items-center">
              <h1 className="font-bold text-2xl mb-2">React Tree Select</h1>
              <FaBars onClick={() => setExpanded(!expanded)} className="h-7 w-7 lg:hidden text-slate-400 transition-all hover:cursor-pointer hover:text-white" />
            </div>
            <hr />
            <SideItem
              active={props.currentHash === 'installation'}
              className={`${expanded ? 'p-2' : 'h-0 lg:h-auto lg:p-2'} lg:flex overflow-hidden lg:overflow-visible`}
              href='#installation'
              onClick={handleClick}
            >
              Installation
            </SideItem>
            <SideItem
              active={props.currentHash === 'getting-started'}
              className={`${expanded ? 'p-2' : 'h-0 lg:h-auto lg:p-2'} lg:flex overflow-hidden lg:overflow-visible`}
              href='#getting-started'
              onClick={handleClick}
            >
              Getting Started
            </SideItem>
            <SideItem
              active={props.currentHash === 'api'}
              className={`${expanded ? 'p-2' : 'h-0 lg:h-auto lg:p-2'} lg:flex overflow-hidden lg:overflow-visible`}
              href='#api'
              onClick={handleClick}
            >
              Props API
            </SideItem>
            {/* <SideItem className={`${expanded ? 'p-2' : 'h-0 lg:h-auto lg:p-2'} lg:flex overflow-hidden lg:overflow-visible`} href='#customization'>Customization</SideItem> */}
            <SideItem
              active={props.currentHash === 'examples'}
              className={`${expanded ? 'p-2' : 'h-0 lg:h-auto lg:p-2'} lg:flex overflow-hidden lg:overflow-visible`}
              href='#examples'
              onClick={handleClick}
            >
              Examples
            </SideItem>
            <SideItem className={`${expanded ? 'p-2' : 'h-0 lg:h-auto lg:p-2'} lg:flex overflow-hidden lg:overflow-visible`} target='_blank' href='https://github.com/Attebyte/react-tree-select' >
              <FaGithub className="h-5 w-5 me-2" />
              GitHub
            </SideItem>
            <SideItem className={`${expanded ? 'p-2' : 'h-0 lg:h-auto lg:p-2'} lg:flex overflow-hidden lg:overflow-visible`} target='_blank' href='https://twitter.com/attebyte' >
              <FaXTwitter className="h-5 w-5 me-2" />
              Twitter
            </SideItem>
            <SideItem className={`${expanded ? 'p-2' : 'h-0 lg:h-auto lg:p-2'} lg:flex overflow-hidden lg:overflow-visible`} target='_blank' href='https://www.buymeacoffee.com/tristan10'>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/attebyte-8542f.appspot.com/o/react-tree-select%2Fbmc-icon-light.svg?alt=media&token=ce136766-5dd2-4ec2-a96f-377578471e6d"
                alt="Buy Me a Coffee"
                className="h-5 w-5 me-2" />
              Buy Me a Coffee
            </SideItem>
            <div className="h-full hidden lg:flex items-end p-2 border-l border-slate-700">
              <span className="text-xs hidden lg:inline-block text-slate-500">Copyright © Attebyte LLC {new Date().getFullYear()}</span>
            </div>
          </div>
          <div id='scroll' className="basis-full p-4 relative overflow-x-hidden overflow-y-scroll">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout;
