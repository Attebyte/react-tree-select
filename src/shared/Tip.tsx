import { FaLightbulb } from "react-icons/fa6";

interface Props {

}

const Tip = (props: React.PropsWithChildren<Props>) => {
  return (
    <div className='bg-slate-500 rounded-lg p-3 my-4 font-bold flex'>
      <FaLightbulb className='inline w-5 h-5 flex-shrink-0 mr-3' />
      <div>
        {props.children}
      </div>
    </div>
  )
}

export default Tip;