import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

// interface Props extends LinkProps {
//   external?: boolean;
//   to: string;
// }

const SideItem = (props: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>>) => {
  // const { to, external, ...rest } = props;

  const className = `
    w-full h-10 flex align-middle p-2 transition-all duration-300
    hover:cursor-pointer bg-size-200 border-l border-slate-700 hover:border-slate-400
    hover:bg-gradient-to-r to-slate-800 via-slate-700 from-slate-600 bg-pos-0 hover:bg-pos-100
    hover:font-bold
  `;

    return (
      <a {...props} className={className}
      >
        {props.children}
      </a>
    );
}

export default SideItem;