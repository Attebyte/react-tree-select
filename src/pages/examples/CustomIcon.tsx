import TreeSelect, { ExpandIconProps } from "../../../lib/main";
import SourceLinkButton from "../../shared/SourceLinkButton";
import ExampleData from "../../ExampleData.json";
import ExampleNode from "../../models/ExampleNode";
import { FaMinus } from "react-icons/fa6";

const CustomIconComponent = (props: ExpandIconProps<ExampleNode>) => {
  if (!props.standardComponentProps.node.children || props.standardComponentProps.node.children.length === 0)
    return null;

  return (
    <div className='relative align-middle inline-block ml-4 w-5 h-5'>
      <FaMinus className="absolute h-5 w-5" />
      <FaMinus
        className={`
          absolute h-5 w-5 transition-all
          ${props.expanded ? '' : 'rotate-90'}
        `}
      />
    </div>
  );
}

const CustomIcon = () => {
  return (
    <div className='relative'>
      <SourceLinkButton href='https://github.com/Attebyte/react-tree-select/blob/main/src/pages/examples/CustomIcon.tsx' />
      <TreeSelect
        defaultData={ExampleData as ExampleNode[]}
        uniqueIDProperty={'value'}
        childrenProperty={'children'}
        labelProperty={'label'}
        valueProperty={'included'}

        className='bg-neutral-800 text-white p-6 rounded font-sans'

        CustomExpandIconComponent={CustomIconComponent}
      />
    </div>
  );
}

export default CustomIcon;