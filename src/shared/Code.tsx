import { useState } from "react";
import { FaCheck, FaCopy } from "react-icons/fa6"

interface Props extends React.HTMLProps<HTMLPreElement> {

}

const Code = (props: React.PropsWithChildren<Props>) => {

    const [copied, setCopied] = useState(false);

    const handleCopyClick = () => {
        navigator.clipboard.writeText(props.children as string);
        setCopied(true);
    }

    return (
        <pre {...props} className={`bg-neutral-800 p-3 rounded-lg mb-6 min-h-14 flex`}>

            <code className='basis-full'>
                {props.children}
            </code>
            <button
                title='Copy'
                className={`
                    basis-10 flex-grow-0 h-10
                    transition-all p-2 rounded text-lg text-gray-500 border-2
                    ${copied ? 'border-green-500' : 'border-gray-500 hover:text-gray-100 hover:border-gray-100'}
                `}
                onClick={handleCopyClick}
            >
                {copied ? <FaCheck /> : <FaCopy />}
            </button>
        </pre>
    )
}

export default Code;