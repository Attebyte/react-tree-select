import React from 'react';


interface Props extends React.HTMLProps<HTMLDivElement> { }

interface Property {
    name: string;
    type: string;
    default?: string;
    required?: string;
    description: string;
}

const API = (props: Props) => {
    return (
        <div {...props}>
            <a href='#api' hidden>API</a>
            <h2 className='text-2xl font-bold mb-2 underline'>API</h2>
            <h4 className='font-bold'>TreeSelect <span className='text-sm text-neutral-400'>extends HTMLDivElement</span></h4>
            <div className='flex flex-col'>
                <div className='flex flex-row rounded-t-lg p-2 font-bold bg-neutral-800'>
                    <div className='w-3/12'>Property</div>
                    <div className='w-2/12'>Type</div>
                    <div className='w-2/12'>Default</div>
                    <div className='w-2/12'>Required?</div>
                    <div className='w-3/12'>Description</div>
                </div>
                {TreeSelectProperties.map((prop, index) => (
                    <div key={`treeselect-${index}`} className='flex flex-row p-2 table-row-alt'>
                        <div className='w-3/12'>{prop.name}</div>
                        <div className='w-2/12'><code>{prop.type}</code></div>
                        <div className='w-2/12'>{prop.default}</div>
                        <div className='w-2/12'>{prop.required}</div>
                        <div className='w-3/12'>{prop.description}</div>
                    </div>
                ))}
            </div>

            <h4 className='font-bold mt-6'>Standard Properties</h4>
            <p>TreeNode, NodeLable, NodeCheck, and ExpandIcon all receive a standard set of properties passed down from TreeSelect.</p>
            <div className='flex flex-col mb-6'>
                <div className='flex flex-row rounded-t-lg p-2 font-bold bg-neutral-800'>
                    <div className='w-3/12'>Property</div>
                    <div className='w-3/12'>Type</div>
                    <div className='w-6/12'>Description</div>
                </div>
                {StandardProperties.map((prop, index) => (
                    <div key={`standard-${index}`} className='flex flex-row p-2 table-row-alt'>
                        <div className='w-3/12'>{prop.name}</div>
                        <div className='w-3/12'><code>{prop.type}</code></div>
                        <div className='w-6/12'>{prop.description}</div>
                    </div>
                ))}
            </div>

            <h4 className='font-bold mt-6'>TreeNode <span className='text-sm text-neutral-400'>extends HTMLDivElement</span></h4>
            <div className='flex flex-col mb-6'>
                <div className='flex flex-row rounded-t-lg p-2 font-bold bg-neutral-800'>
                    <div className='w-3/12'>Property</div>
                    <div className='w-3/12'>Type</div>
                    <div className='w-6/12'>Description</div>
                </div>
                {TreeNodeProperties.map((prop, index) => (
                    <div key={`treenode-${index}`} className='flex flex-row p-2 table-row-alt'>
                        <div className='w-3/12'>{prop.name}</div>
                        <div className='w-3/12'><code>{prop.type}</code></div>
                        <div className='w-6/12'>{prop.description}</div>
                    </div>
                ))}
            </div>

            <h4 className='font-bold mt-6'>NodeLabel <span className='text-sm text-neutral-400'>extends HTMLSpanElement</span></h4>
            <div className='flex flex-col mb-6'>
                <div className='flex flex-row rounded-t-lg p-2 font-bold bg-neutral-800'>
                    <div className='w-3/12'>Property</div>
                    <div className='w-3/12'>Type</div>
                    <div className='w-6/12'>Description</div>
                </div>
                {NodeLabelProperties.map((prop, index) => (
                    <div key={`nodelabel-${index}`} className='flex flex-row p-2 table-row-alt'>
                        <div className='w-3/12'>{prop.name}</div>
                        <div className='w-3/12'><code>{prop.type}</code></div>
                        <div className='w-6/12'>{prop.description}</div>
                    </div>
                ))}
            </div>

            <h4 className='font-bold mt-6'>NodeCheck <span className='text-sm text-neutral-400'>extends HTMLInputElement</span></h4>
            <div className='flex flex-col mb-6'>
                <div className='flex flex-row rounded-t-lg p-2 font-bold bg-neutral-800'>
                    <div className='w-3/12'>Property</div>
                    <div className='w-3/12'>Type</div>
                    <div className='w-6/12'>Description</div>
                </div>
                {NodeCheckProperties.map((prop, index) => (
                    <div key={`nodecheck-${index}`} className='flex flex-row p-2 table-row-alt'>
                        <div className='w-3/12'>{prop.name}</div>
                        <div className='w-3/12'><code>{prop.type}</code></div>
                        <div className='w-6/12'>{prop.description}</div>
                    </div>
                ))}
            </div>

            <h4 className='font-bold mt-6'>ExpandIcon <span className='text-sm text-neutral-400'>extends HTMLSpanElement</span></h4>
            <div className='flex flex-col'>
                <div className='flex flex-row rounded-t-lg p-2 font-bold bg-neutral-800'>
                    <div className='w-3/12'>Property</div>
                    <div className='w-3/12'>Type</div>
                    <div className='w-6/12'>Description</div>
                </div>
                {ExpandIconProperties.map((prop, index) => (
                    <div key={`expandicon-${index}`} className='flex flex-row p-2 table-row-alt'>
                        <div className='w-3/12'>{prop.name}</div>
                        <div className='w-3/12'><code>{prop.type}</code></div>
                        <div className='w-6/12'>{prop.description}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const TreeSelectProperties: Property[] = [
    {
        name: 'defaultData',
        type: 'T[]',
        default: '',
        required: 'either / or',
        description: 'Data to render. For uncontrolled usage.'
    },
    {
        name: 'data',
        type: 'T[]',
        default: '',
        required: 'either / or',
        description: 'Data to render. For controlled usage.'
    },
    {
        name: 'onChange',
        type: '(data: T[]) => void',
        default: '',
        required: 'probably',
        description: 'Function called when a node selection changes. Only optional if using component for display only.'
    },
    {
        name: 'uniqueIDProperty',
        type: 'keyof T',
        default: '',
        required: 'yes',
        description: 'Property that uniquely identifies node.'
    },
    {
        name: 'labelProperty',
        type: 'keyof T',
        default: '',
        required: 'yes',
        description: 'Property that contains the node label.'
    },
    {
        name: 'childrenProperty',
        type: 'keyof T',
        default: '',
        required: 'yes',
        description: 'Property that contains children nodes.'
    },
    {
        name: 'valueProperty',
        type: 'keyof T',
        default: '',
        required: 'probably',
        description: 'Property used to indicate if node is selected. Only optional if using component for display only.'
    },
    {
        name: 'disabledProperty',
        type: 'keyof T',
        default: '',
        required: 'no',
        description: 'Property used to indicate if node is disabled.'
    },
    {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        required: 'no',
        description: 'Disable all nodes.'
    },
    {
        name: 'expandDisabledNodes',
        type: 'boolean',
        default: 'true',
        required: 'no',
        description: 'Allow disabled nodes to be expanded.'
    },
    {
        name: 'defaultExpanded',
        type: 'boolean',
        default: 'false',
        required: 'no',
        description: 'Start with all nodes expanded.'
    },
    {
        name: 'chainedSelect',
        type: 'boolean',
        default: 'true',
        required: 'no',
        description: 'Selecting parents select all children. Selecting all children will select parent. Children of disabled nodes are disabled. Parents indicate indeterminate state if some children are selected.'
    },
    {
        name: 'nodeClassName',
        type: 'string',
        default: '',
        required: 'no',
        description: 'Class to apply to node.'
    },
    {
        name: 'nodeStyle',
        type: 'React.CSSProperties',
        default: '',
        required: 'no',
        description: 'Style to apply to node.'
    },
    {
        name: 'labelClassName',
        type: 'string',
        default: '',
        required: 'no',
        description: 'Class to apply to label.'
    },
    {
        name: 'labelStyle',
        type: 'React.CSSProperties',
        default: '',
        required: 'no',
        description: 'Style to apply to label.'
    },
    {
        name: 'iconClassName',
        type: 'string',
        default: '',
        required: 'no',
        description: 'Class to apply to icon.'
    },
    {
        name: 'iconStyle',
        type: 'React.CSSProperties',
        default: '',
        required: 'no',
        description: 'Style to apply to icon.'
    },
    {
        name: 'inputClassName',
        type: 'string',
        default: '',
        required: 'no',
        description: 'Class to apply to input.'
    },
    {
        name: 'inputStyle',
        type: 'React.CSSProperties',
        default: '',
        required: 'no',
        description: 'Style to apply to input.'
    },
    {
        name: 'CustomNodeComponent',
        type: 'React.ComponentType<TreeNodeProps<T>>',
        default: '',
        required: 'no',
        description: 'Override the default Node component.'
    },
    {
        name: 'CustomLabelComponent',
        type: 'React.ComponentType<NodeLabelProps<T>>',
        default: '',
        required: 'no',
        description: 'Override the default Label component.'
    },
    {
        name: 'CustomCheckComponent',
        type: 'React.ComponentType<NodeCheckProps<T>>',
        default: '',
        required: 'no',
        description: 'Override the default Check component.'
    },
    {
        name: 'CustomExpandIconComponent',
        type: 'React.ComponentType<ExpandIconProps<T>>',
        default: '',
        required: 'no',
        description: 'Override the default Icon component.'
    }
];


const StandardProperties: Property[] = [
    {
        name: 'node',
        type: 'T',
        description: 'Current node used to render component.'
    },
    {
        name: 'expanded',
        type: 'boolean',
        description: 'true if the current node is expanded.'
    },
    {
        name: 'uniqueIDProperty',
        type: 'keyof T',
        description: 'Property of the nodes unique identifier.'
    },
    {
        name: 'labelProperty',
        type: 'keyof T',
        description: 'Property of the nodes label.'
    },
    {
        name: 'valueProperty',
        type: 'keyof T',
        description: 'Property of the nodes value.'
    },
    {
        name: 'childrenProperty',
        type: 'keyof T',
        description: 'Property of the nodes children.'
    },
    {
        name: 'disabledProperty',
        type: 'keyof T',
        description: 'Property indicating if the node is disabled.'
    }
];

const TreeNodeProperties: Property[] = [
    {
        name: 'node',
        type: 'T',
        description: 'Data to render.'
    },
    {
        name: 'disabled',
        type: 'boolean',
        description: 'True if the node is disabled.'
    },
    {
        name: 'expandDisabledNodes',
        type: 'boolean',
        description: 'Allow disabled nodes to be expanded.'
    },
    {
        name: 'defaultExpanded',
        type: 'boolean',
        description: 'Start with all nodes expanded.'
    },
    {
        name: 'chainedSelect',
        type: 'boolean',
        description: 'Selecting parents select all children. Selecting all children will select parent. Children of disabled nodes are disabled. Parents indicate indeterminate state if some children are selected.'
    },
    {
        name: 'labelClassName',
        type: 'string',
        description: 'Class to apply to label.'
    },
    {
        name: 'labelStyle',
        type: 'React.CSSProperties',
        description: 'Style to apply to label.'
    },
    {
        name: 'iconClassName',
        type: 'string',
        description: 'Class to apply to icon.'
    },
    {
        name: 'iconStyle',
        type: 'React.CSSProperties',
        description: 'Style to apply to icon.'
    },
    {
        name: 'inputClassName',
        type: 'string',
        description: 'Class to apply to input.'
    },
    {
        name: 'inputStyle',
        type: 'React.CSSProperties',
        description: 'Style to apply to input.'
    },
    {
        name: 'CustomLabelComponent',
        type: 'React.ComponentType<NodeLabelProps<T>>',
        description: 'Override the default Label component.'
    },
    {
        name: 'CustomCheckComponent',
        type: 'React.ComponentType<NodeCheckProps<T>>',
        description: 'Override the default Check component.'
    },
    {
        name: 'CustomExpandIconComponent',
        type: 'React.ComponentType<ExpandIconProps<T>>',
        description: 'Override the default Icon component.'
    }
];

const NodeLabelProperties: Property[] = [
    {
        name: 'label',
        type: 'string',
        description: 'Label to render.'
    },
    {
        name: 'hasChildren',
        type: 'boolean',
        description: 'True if the node has children.'
    },
    {
        name: 'expanded',
        type: 'boolean',
        description: 'True if the node is expanded.'
    },
    {
        name: 'expandDisabledNodes',
        type: 'boolean',
        description: 'True if disabled nodes can be expanded.'
    },
    {
        name: 'iconClassName',
        type: 'string',
        description: 'Class to apply to icon.'
    },
    {
        name: 'iconStyle',
        type: 'React.CSSProperties',
        description: 'Style to apply to icon.'
    },
    {
        name: 'ExpandIconComponent',
        type: 'React.ComponentType<ExpandIconProps<T>>',
        description: 'Component to render the expand icon.'
    }
];

const NodeCheckProperties: Property[] = [
    {
        name: 'checked',
        type: 'boolean | null',
        description: 'True if the node is checked. Null if indeterminate.'
    },
    {
        name: 'expanded',
        type: 'boolean',
        description: 'True if the node is expanded.'
    },
    {
        name: 'disabled',
        type: 'boolean',
        description: 'True if the node is disabled.'
    }
];

const ExpandIconProperties: Property[] = [
    {
        name: 'expanded',
        type: 'boolean',
        description: 'True if the node is expanded.'
    },
    {
        name: 'show',
        type: 'boolean',
        description: 'True if the icon should be shown.'
    }
];

export default API;