import TreeSelect from "../../../lib/main";
import SourceLinkButton from "../../shared/SourceLinkButton";
import ExampleData from '../../ExampleData.json';
import ExampleNode from "../../models/ExampleNode";

const BasicProps = () => {

  let data = [...ExampleData] as ExampleNode[];
  if (data[0]?.children) {
    data[0].children[0].disabled = true;
  }

  return (
    <div className='relative'>
      <SourceLinkButton href='https://github.com/Attebyte/react-tree-select/blob/main/src/pages/examples/BasicProps.tsx' />
      <TreeSelect
        defaultData={ExampleData as ExampleNode[]}
        uniqueIDProperty={'value'}
        childrenProperty={'children'}
        labelProperty={'label'}
        valueProperty={'included'}
        disabledProperty={'disabled'}
        
        defaultExpanded={true}
        chainedSelect={false}
        expandDisabledNodes={false}

        className='bg-neutral-800 text-white p-6 rounded font-sans'
      />
    </div>
  );
}

export default BasicProps;