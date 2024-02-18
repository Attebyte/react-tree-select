import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

// interface Props extends LinkProps {
//   external?: boolean;
//   to: string;
// }

const SideItem = (props: React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement> & { active?: boolean }>) => {
  const { active, ...rest } = props;

  const className = `
    flex align-middle transition-all duration-300
    hover:cursor-pointer bg-size-200 border-l border-slate-700 hover:border-slate-400
    hover:bg-gradient-to-r to-slate-800 via-slate-700 from-slate-600 bg-pos-0 hover:bg-pos-100
    hover:font-bold
    ${props.active ? 'bg-gradient-to-r to-slate-800 via-slate-700 from-slate-600 bg-pos-100 border-slate-400' : ''}
  `;

    return (
      <a {...rest} className={`${className} ${props.className}`}
      >
        {props.children}
      </a>
    );
}

export default SideItem;