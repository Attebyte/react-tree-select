import React from 'react';


interface Props extends React.HTMLProps<HTMLDivElement> { }

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
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>defaultData</div>
                    <div className='w-2/12'><code>T[]</code></div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>either / or</div>
                    <div className='w-3/12'>Data to render. For uncontrolled usage.</div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>data</div>
                    <div className='w-2/12'><code>T[]</code></div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>either / or</div>
                    <div className='w-3/12'>Data to render. For controlled usage.</div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>onChange</div>
                    <div className='w-2/12'><code>(data: T[]) =&gt; void</code></div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>probably</div>
                    <div className='w-3/12'>Function called when a node selection changes. Only optional if using component for display only.</div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>uniqueIDProperty</div>
                    <div className='w-2/12'><code>string | number | symbol</code></div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>yes</div>
                    <div className='w-3/12'>Property that uniquely identifies node.</div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>labelProperty</div>
                    <div className='w-2/12'><code>string | number | symbol</code></div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>yes</div>
                    <div className='w-3/12'>Property that contains the node label.</div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>childrenProperty</div>
                    <div className='w-2/12'><code>string | number | symbol</code></div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>yes</div>
                    <div className='w-3/12'>Property that contains children nodes.</div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>valueProperty</div>
                    <div className='w-2/12'><code>string | number | symbol</code></div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>probably</div>
                    <div className='w-3/12'>Property used to indicate if node is selected. Only optional if using component for display only.</div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>disabledProperty</div>
                    <div className='w-2/12'><code>string | number | symbol</code></div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>Property used to indicate if node is disabled.</div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>disabled</div>
                    <div className='w-2/12'><code>boolean</code></div>
                    <div className='w-2/12'>false</div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>Disable all nodes.</div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>expandDisabledNodes</div>
                    <div className='w-2/12'><code>boolean</code></div>
                    <div className='w-2/12'>true</div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>Allow disabled nodes to be expanded.</div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>defaultExpanded</div>
                    <div className='w-2/12'><code>boolean</code></div>
                    <div className='w-2/12'>false</div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>Start with all nodes expanded.</div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>chainedSelect</div>
                    <div className='w-2/12'><code>boolean</code></div>
                    <div className='w-2/12'>true</div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>
                        Selecting parents select all children. Selecting all children will select parent. 
                        Children of disabled nodes are disabled. Parents indicate indeterminate state if some children are selected.
                    </div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>nodeClassName</div>
                    <div className='w-2/12'><code>string</code></div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>
                        Class to apply to node.
                    </div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>nodeStyle</div>
                    <div className='w-2/12 truncate'>React.CSSProperties</div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>
                        Style to apply to node.
                    </div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>labelClassName</div>
                    <div className='w-2/12'><code>string</code></div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>
                        Class to apply to label.
                    </div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>labelStyle</div>
                    <div className='w-2/12 truncate'>React.CSSProperties</div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>
                        Style to apply to label.
                    </div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>iconClassName</div>
                    <div className='w-2/12'><code>string</code></div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>
                        Class to apply to icon.
                    </div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>iconStyle</div>
                    <div className='w-2/12 truncate'>React.CSSProperties</div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>
                        Style to apply to icon.
                    </div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>inputClassName</div>
                    <div className='w-2/12'><code>string</code></div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>
                        Class to apply to input.
                    </div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>inputStyle</div>
                    <div className='w-2/12 truncate'>React.CSSProperties</div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>
                        Style to apply to input.
                    </div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>CustomNodeComponent</div>
                    <div className='w-2/12 truncate' title='React.ComponentType<TreeNodeProps<T>>'>{'React.ComponentType<TreeNodeProps<T>>'}</div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>
                        Override the default Node component.
                    </div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>CustomLabelComponent</div>
                    <div className='w-2/12 truncate' title='React.ComponentType<NodeLabelProps<T>>'>{'React.ComponentType<NodeLabelProps<T>>'}</div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>
                        Override the default Label component.
                    </div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>CustomCheckComponent</div>
                    <div className='w-2/12 truncate' title='React.ComponentType<NodeCheckProps<T>>'>{'React.ComponentType<NodeCheckProps<T>>'}</div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>
                        Override the default Check component.
                    </div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>CustomExpandIconComponent</div>
                    <div className='w-2/12 truncate' title='React.ComponentType<ExpandIconProps<T>>'>{'React.ComponentType<ExpandIconProps<T>>'}</div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>
                        Override the default Icon component.
                    </div>
                </div>
            </div>

            <h4 className='font-bold mt-6'>Standard Properties</h4>
            <p>TreeNode, NodeLable, NodeCheck, and ExpandIcon all receive a standard set of properties passed down from TreeSelect.</p>
            <div className='flex flex-col mb-6'>
                <div className='flex flex-row rounded-t-lg p-2 font-bold bg-neutral-800'>
                    <div className='w-3/12'>Property</div>
                    <div className='w-3/12'>Type</div>
                    <div className='w-6/12'>Description</div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>node</div>
                    <div className='w-3/12'><code>T</code></div>
                    <div className='w-6/12'>Current node used to render component.</div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>expanded</div>
                    <div className='w-3/12'><code>boolean</code></div>
                    <div className='w-6/12'>true if the current node is expanded.</div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>uniqueIDProperty</div>
                    <div className='w-3/12'><code>string | number | symbol</code></div>
                    <div className='w-6/12'>Property of the nodes unique identifier.</div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>labelProperty</div>
                    <div className='w-3/12'><code>string | number | symbol</code></div>
                    <div className='w-6/12'>Property of the nodes label.</div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>valueProperty</div>
                    <div className='w-3/12'><code>string | number | symbol</code></div>
                    <div className='w-6/12'>Property of the nodes value.</div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>childrenProperty</div>
                    <div className='w-3/12'><code>string | number | symbol</code></div>
                    <div className='w-6/12'>Property of the nodes children.</div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>disabledProperty</div>
                    <div className='w-3/12'><code>string | number | symbol</code></div>
                    <div className='w-6/12'>Property indicating if the node is disabled.</div>
                </div>
            </div>

            <h4 className='font-bold'>TreeNode <span className='text-sm text-neutral-400'>extends HTMLDivElement</span></h4>
            <div className='flex flex-col'>
                <div className='flex flex-row rounded-t-lg p-2 font-bold bg-neutral-800'>
                    <div className='w-3/12'>Property</div>
                    <div className='w-3/12'>Type</div>
                    <div className='w-6/12'>Description</div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>node</div>
                    <div className='w-3/12'><code>T</code></div>
                    <div className='w-6/12'>Data to render. For uncontrolled usage.</div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>disabled</div>
                    <div className='w-3/12'><code>boolean</code></div>
                    <div className='w-6/12'>True if the node is disabled.</div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>expandDisabledNodes</div>
                    <div className='w-3/12'><code>boolean</code></div>
                    <div className='w-6/12'>Allow disabled nodes to be expanded.</div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>defaultExpanded</div>
                    <div className='w-3/12'><code>boolean</code></div>
                    <div className='w-6/12'>Start with all nodes expanded.</div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>chainedSelect</div>
                    <div className='w-3/12'><code>boolean</code></div>
                    <div className='w-6/12'>
                        Selecting parents select all children. Selecting all children will select parent. 
                        Children of disabled nodes are disabled. Parents indicate indeterminate state if some children are selected.
                    </div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>nodeClassName</div>
                    <div className='w-2/12'><code>string</code></div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>
                        Class to apply to node.
                    </div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>nodeStyle</div>
                    <div className='w-2/12 truncate'>React.CSSProperties</div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>
                        Style to apply to node.
                    </div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>labelClassName</div>
                    <div className='w-2/12'><code>string</code></div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>
                        Class to apply to label.
                    </div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>labelStyle</div>
                    <div className='w-2/12 truncate'>React.CSSProperties</div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>
                        Style to apply to label.
                    </div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>iconClassName</div>
                    <div className='w-2/12'><code>string</code></div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>
                        Class to apply to icon.
                    </div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>iconStyle</div>
                    <div className='w-2/12 truncate'>React.CSSProperties</div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>
                        Style to apply to icon.
                    </div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>inputClassName</div>
                    <div className='w-2/12'><code>string</code></div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>
                        Class to apply to input.
                    </div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>inputStyle</div>
                    <div className='w-2/12 truncate'>React.CSSProperties</div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>
                        Style to apply to input.
                    </div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>CustomNodeComponent</div>
                    <div className='w-2/12 truncate' title='React.ComponentType<TreeNodeProps<T>>'>{'React.ComponentType<TreeNodeProps<T>>'}</div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>
                        Override the default Node component.
                    </div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>CustomLabelComponent</div>
                    <div className='w-2/12 truncate' title='React.ComponentType<NodeLabelProps<T>>'>{'React.ComponentType<NodeLabelProps<T>>'}</div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>
                        Override the default Label component.
                    </div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>CustomCheckComponent</div>
                    <div className='w-2/12 truncate' title='React.ComponentType<NodeCheckProps<T>>'>{'React.ComponentType<NodeCheckProps<T>>'}</div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>
                        Override the default Check component.
                    </div>
                </div>
                <div className='flex flex-row p-2 table-row-alt'>
                    <div className='w-3/12'>CustomExpandIconComponent</div>
                    <div className='w-2/12 truncate' title='React.ComponentType<ExpandIconProps<T>>'>{'React.ComponentType<ExpandIconProps<T>>'}</div>
                    <div className='w-2/12'></div>
                    <div className='w-2/12'>no</div>
                    <div className='w-3/12'>
                        Override the default Icon component.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default API;