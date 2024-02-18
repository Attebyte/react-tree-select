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
        <pre {...props} className={`relative ${props.className}`}>
            <button
                title='Copy'
                className={`
                    absolute transition-all top-0 right-0 p-2 m-2 rounded text-lg text-gray-500 border-2
                    ${copied ? 'border-green-500' : 'border-gray-500 hover:text-gray-100 hover:border-gray-100'}
                `}
                onClick={handleCopyClick}
            >
                {copied ? <FaCheck /> : <FaCopy />}
            </button>
            <code>
                {props.children}
            </code>
        </pre>
    )
}

export default Code;