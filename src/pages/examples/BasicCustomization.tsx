import TreeSelect from "../../../lib/main";
import ExampleNode from "../../models/ExampleNode";
import SourceLinkButton from "../../shared/SourceLinkButton";
import ExampleData from "../../ExampleData.json";

const BasicCustomization = () => {
  return (
    <div className='relative'>
      <SourceLinkButton href='' />
      <TreeSelect
        defaultData={ExampleData as ExampleNode[]}
        uniqueIDProperty={'value'}
        childrenProperty={'children'}
        labelProperty={'label'}
        valueProperty={'included'}

        className='bg-neutral-800 text-white p-6 rounded font-sans'
        inputClassName="checked:text-blue-500 text-orange-600 h-8 w-8 after:text-2xl"
        labelClassName="font-bold text-4xl"
        iconClassName="text-neutral-500"
      />
    </div>
  );
};

export default BasicCustomization;