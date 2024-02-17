# React Tree Select &nbsp;&nbsp;<img src="https://firebasestorage.googleapis.com/v0/b/attebyte-8542f.appspot.com/o/react-tree-select%2Freact.svg?alt=media&token=a2cf555d-d091-4b45-af56-6fc97062c66d" alt="React Icon" width="30" height="30" /> &nbsp; <img src="https://firebasestorage.googleapis.com/v0/b/attebyte-8542f.appspot.com/o/react-tree-select%2Ftailwind.svg?alt=media&token=7655c1f4-9525-4c53-acfa-07b4d95edb22" alt="React Icon" width="30" height="30" /> 
A simple, highly customizable tree component. View full documentation.

## Installation
Install using the package manager of your choice.

```
npm i @attebyte/react-tree-select

yarn add @attebyte/react-tree-select
```

## Getting Started

Simply pass your tree shaped data to TreeSelect along with the required properties.

```
import { useState } from 'react';
import TreeSelect from '@attebyte/react-tree-select';

interface ExampleNode {
  label: string;
  value: number;
  included?: boolean | null;
  children?: ExampleNode[];
}

const App = () => {

  const [data, setData] = useState<ExampleNode[]>(ExampleData as ExampleNode[]);

  return (
      <TreeSelect
        data={data}
        uniqueIDProperty={'value'}
        childrenProperty={'children'}
        labelProperty={'label'}
        valueProperty={'included'}
        onChange={setData}
      />
  )
}

const ExampleData: ExampleNode[] = [
  {
    label: 'Root 1',
    value: 1,
    children: [
      {
        label: 'Child 1',
        value: 2,
        children: [
          {
            label: 'Grandchild 1',
            value: 3,
          },
          {
            label: 'Grandchild 2',
            value: 4,
          }
        ]
      },
      {
        label: 'Child 2',
        value: 5,
      }
    ]
  },
  {
    label: 'Root 2',
    value: 6,
    children: [
      {
        label: 'Child 3',
        value: 7,
      },
      {
        label: 'Child 4',
        value: 8,
      }
    ]
  }
];

export default App
```

<img src="https://firebasestorage.googleapis.com/v0/b/attebyte-8542f.appspot.com/o/react-tree-select%2Ftree-select-example.gif?alt=media&token=0fb3fbaf-95b2-40d9-a065-be2e08515272" alt="Example GIF">

## Props
Commonly required props for most use cases. To see a full list of available properties, see our full documentation.

| Property | Type | Required? | Description |
| ----------- | ----------- | ----------- | ----------- |
| `data` | `object[]` | yes | The data to be rendered |
| `uniqueIDProperty` | `string \| number \| symbol` | yes | The property of your tree node that uniquely identifies the node |
| `labelProperty` | `string \| number \| symbol` | yes | The property of your node to display |
| `childrenProperty` | `string \| number \| symbol` | yes | The property of your node that holds the node's children |
| `valueProperty` | `string \| number \| symbol` | yes* | Required if you intend to use the tree to select nodes. If using for display purposes only, not required |
| `onChange` | `(data: object[]) => void` | yes* | Required if you intend to use the the tree to select nodes. Called every time a node selection is changed with the updated tree

## Customization
This library is built with customization in mind and contains minimal default styles using tailwind. The library consists of 4 replacable parts:
 - `TreeNode` - The container for an individual node
 - `NodeLabel` - The label displyed within each node
 - `NodeCheck` - The checkbox used to select a node or indicate descendent's selections
 - `ExpandIcon` - Icon to indicate if a node has children or is collapsed / expanded
 For additional information and examples of customization, please see our full documentation.

 ## Roadmap
 - Initial Release ✅
 - Improve Performance
 - Improve documentation
 - Improve Test Suite

<br/>

---

<br/>

<a href="https://www.buymeacoffee.com/tristan10" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://firebasestorage.googleapis.com/v0/b/attebyte-8542f.appspot.com/o/react-tree-select%2Fbmc-logo-light.svg?alt=media&token=03a8ffd4-3e98-4c8e-9e7a-b8c200c92ed6">
    <img style="color: white;" src="https://firebasestorage.googleapis.com/v0/b/attebyte-8542f.appspot.com/o/react-tree-select%2Fbmc-logo.svg?alt=media&token=357749a8-a191-46de-88f4-b7783517b806" alt="Buy Me A Coffee Logo" title="Buy Me A Coffee" height="40" />
  </picture>
</a>

This is my first open source project and feedback is always appreciated. [Twitter](https://twitter.com/tristanattebery)