import { FaGithub } from "react-icons/fa6";

interface Props {
  href: string;
}

const SourceLinkButton = (props: Props) => {
  return (
    <button
      title='View Source'
      className={`
                    absolute transition-all top-0 right-0 p-2 m-2 rounded text-lg text-gray-500 border-2
                    border-gray-500 hover:text-gray-100 hover:border-gray-100
                `}
      onClick={() => window.open(props.href, '_blank')}
    >
      <FaGithub />
    </button>
  )
}

export default SourceLinkButton;