import { FaGithub, FaXTwitter } from "react-icons/fa6";
import SideItem from "./SideItem";


interface Props {

}

const Layout = (props: React.PropsWithChildren<Props>) => {
  return (
    <div className="h-full w-full flex flex-column overflow-hidden bg-slate-800 text-white">
      <div className="basis-full lg:basis-[1200px] mx-auto ">
        <div className="basis-full h-full grow-1 shrink-0 flex flex-row overflow-hidden">
          <div className="basis-72 flex flex-col grow-0 shrink-0 p-2">
            <h1 className="font-bold text-2xl mb-2">React Tree Select</h1>
            <hr />
            <SideItem href='#installation'>Installation</SideItem>
            <SideItem href='#gettingstarted'>Getting Started</SideItem>
            <SideItem href='#api'>Props API</SideItem>
            <SideItem href='#customization'>Customization</SideItem>
            <SideItem href='#examples'>Examples</SideItem>
            <SideItem target='_blank' href='https://github.com/Attebyte/react-tree-select' >
              <FaGithub className="h-5 w-5 me-2" /> GitHub
            </SideItem>
            <SideItem target='_blank' href='https://twitter.com/attebyte' >
              <FaXTwitter className="h-5 w-5 me-2" /> Twitter
            </SideItem>
            <SideItem target='_blank' href='https://www.buymeacoffee.com/tristan10'>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/attebyte-8542f.appspot.com/o/react-tree-select%2Fbmc-icon-light.svg?alt=media&token=ce136766-5dd2-4ec2-a96f-377578471e6d"
                alt="Buy Me a Coffee"
                className="h-5 w-5 me-2" />
              Buy Me a Coffee
            </SideItem>
            <div className="h-full flex items-end p-2 border-l border-slate-700">
              <span className="text-xs text-slate-500">Copyright © Attebyte LLC {new Date().getFullYear()}</span>
            </div>
          </div>
          <div id='scroll' className="basis-full p-4 grow-1 shrink-0 overflow-auto">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout;
