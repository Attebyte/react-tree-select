import Tip from "../../shared/Tip";
import BasicCustomization from "./BasicCustomization";
import BasicProps from "./BasicProps";
import CustomCheck from "./CustomCheck";
import CustomIcon from "./CustomIcon";
import CustomNode from "./CustomNode";

interface Props extends React.HTMLProps<HTMLDivElement> { }



const Examples = (props: Props) => {

  return (
    <div {...props}>
      <h2 id='examples' className='text-2xl font-bold mb-2 underline'>Examples</h2>
      <p>
        Below you will find some examples of various implementations of the TreeSelect component.
        All code is available in the GitHub, with links to the specific example in the upper right of each example.
      </p>

      <h4 className='text-lg font-bold mt-5 mb-2 underline'>Basic Props Usage</h4>
      <p>
        This example utilizes the most basic props of the TreeSelect component. It uses the default components and the default appearance. <br />
        &emsp;<code>{'defaultExpanded={true}'}</code> - All nodes are expanded by default<br />
        &emsp;<code>{'chainedSelect={false}'}</code> - Each node is selected individually <br />
        &emsp;<code>{'expandDisabledNodes={false}'}</code> - Disallow expanding disabled nodes <br />
      </p>
      <BasicProps />
      <Tip>
        Note, since the nodes are expanded by default, disabling the expansion of disabled nodes will cause the disabled node to remain expanded. Turning chainedSelect
        off also allows for children of disabled nodes to be selected. This can be useful when selecting a parent node is not valid.
      </Tip>

      <h4 className='text-lg font-bold mt-5 mb-2 underline'>Basic Customization</h4>
      <p>
        This example showcases basic customization of the TreeSelect component. The default components are used, but the appearance is customized using TailwindCSS classes.
      </p>
      <BasicCustomization />

      <h4 className='text-lg font-bold mt-5 mb-2 underline'>Custom Icon</h4>
      <p>
        This example showcases usage of the CustomExpandIconComponent prop to change the default icon to a custom icon.
        The default icon is a simple caret, but you can use any icon you like!
      </p>
      <CustomIcon />

      <h4 className='text-lg font-bold mt-5 mb-2 underline'>Custom Check</h4>
      <p>
        This example showcases usage of the CustomCheckComponent and CustomExpandIconComponent props to give the appearance of a folder structure.
        Try selecting a file!
      </p>
      <CustomCheck />

      <h4 className='text-lg font-bold mt-5 mb-2 underline'>Custom Node</h4>
      <p>
        This example showcases usage of the CustomNodeComponent prop. Specifying a custom node component allows for complete control over the appearance and behavior of the tree.
        You can choose to utilize the default components within your node, or create something completely custom!
      </p>
      <CustomNode />
      <Tip>
        While this is a valid use of this component, honestly it's a bit of a stretch. I just wanted to show off the flexibility of the component.
        By using a custom node and none of the default components, you are basically just creating your own tree component. But hey, it's possible!
      </Tip>
    </div>
  )
}

export default Examples;