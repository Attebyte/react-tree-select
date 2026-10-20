# React Tree Select

**An accessible, customizable tree select and checkbox tree component for React**, with tri-state (indeterminate) selection, keyboard navigation, TypeScript generics, and replaceable parts.

[![npm version](https://img.shields.io/npm/v/@attebyte/react-tree-select)](https://www.npmjs.com/package/@attebyte/react-tree-select)
[![npm downloads](https://img.shields.io/npm/dm/@attebyte/react-tree-select)](https://www.npmjs.com/package/@attebyte/react-tree-select)
[![CI](https://github.com/Attebyte/react-tree-select/actions/workflows/ci.yml/badge.svg)](https://github.com/Attebyte/react-tree-select/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
![TypeScript](https://img.shields.io/badge/types-TypeScript-3178c6)

**[Documentation](https://rts.attebyte.io)** · **[Examples](https://rts.attebyte.io/docs/examples)** · **[Storybook playground](https://rts.attebyte.io/storybook/index.html)** · **[API reference](https://rts.attebyte.io/docs/api)**

<img src="https://firebasestorage.googleapis.com/v0/b/attebyte-8542f.appspot.com/o/react-tree-select%2Ftree-select-example.gif?alt=media&token=0fb3fbaf-95b2-40d9-a065-be2e08515272" alt="Animated example of React Tree Select: expanding nodes and checking a parent, which checks its children and marks its ancestors as partially selected">

## Features

- **Tri-state selection.** Checking a parent checks its descendants, and parents show checked, unchecked or indeterminate based on what is selected beneath them. Disabled nodes are respected. Turn it off for independent selection.
- **Accessible.** Follows the [WAI-ARIA tree view pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/): a single tab stop, arrow key navigation, and screen reader support for expanded, checked and mixed states. Tested with axe.
- **Works with your data.** Pass your own tree-shaped objects and name the properties that hold the ID, label, children and checked state. TypeScript checks the property names against your node type.
- **Customizable.** Style every part with class names (merged with tailwind-merge), or replace the node, label, checkbox or expand icon with your own components, for example to build a file tree or a comment thread.
- **Controlled or uncontrolled**, with helpers to read the selected IDs.
- **Fast with large trees.** Changes copy only the affected branch and unchanged nodes skip re-rendering.
- **Small.** About 17 KB of JavaScript and 3 KB of CSS, with no global style resets. Supports React 18 and 19 and server-side rendering.

## Installation

```sh
npm install @attebyte/react-tree-select
```

```sh
yarn add @attebyte/react-tree-select
```

```sh
pnpm add @attebyte/react-tree-select
```

## Quick start

```tsx
import TreeSelect from '@attebyte/react-tree-select';
import '@attebyte/react-tree-select/style.css';

interface Category {
  label: string;
  value: number;
  included?: boolean | null; // true = checked, null = partially checked
  children?: Category[];
}

const categories: Category[] = [
  {
    label: 'Root 1',
    value: 1,
    children: [
      {
        label: 'Child 1',
        value: 2,
        children: [
          { label: 'Grandchild 1', value: 3 },
          { label: 'Grandchild 2', value: 4 }
        ]
      },
      { label: 'Child 2', value: 5 }
    ]
  },
  {
    label: 'Root 2',
    value: 6,
    children: [
      { label: 'Child 3', value: 7 },
      { label: 'Child 4', value: 8 }
    ]
  }
];

export default function App() {
  return (
    <TreeSelect
      defaultData={categories}
      uniqueIDProperty='value'
      labelProperty='label'
      childrenProperty='children'
      valueProperty='included'
      onChange={tree => console.log(tree)}
      aria-label='Categories'
    />
  );
}
```

## Reading the selection

`onChange` receives the updated tree. To get the selected IDs, use `getSelectedIDs`:

```tsx
import { getSelectedIDs } from '@attebyte/react-tree-select';

const ids = getSelectedIDs(tree, {
  uniqueIDProperty: 'value',
  childrenProperty: 'children',
  valueProperty: 'included',
  mode: 'leaves' // or 'all' (default), or 'topmost'
});
```

`'leaves'` returns only checked nodes without children, and `'topmost'` lets a fully checked parent stand in for its subtree. `getSelectedNodes` returns the nodes instead of their IDs. See [Selection](https://rts.attebyte.io/docs/selection).

## Controlled usage

Pass `data` instead of `defaultData` to keep the tree in your own state. The tree renders exactly the data it is given, so update it from `onChange`:

```tsx
const [data, setData] = useState(categories);

<TreeSelect
  data={data}
  onChange={setData}
  uniqueIDProperty='value'
  labelProperty='label'
  childrenProperty='children'
  valueProperty='included'
/>
```

Your data is never modified. `onChange` receives a new tree in which unchanged nodes are reused from the previous one, so treat it as immutable. See [Controlled usage](https://rts.attebyte.io/docs/controlled).

## Props

The most commonly used props. See the [API reference](https://rts.attebyte.io/docs/api) for all of them.

| Prop | Type | Description |
| --- | --- | --- |
| `data` / `defaultData` | `T[]` | The tree to render, controlled or uncontrolled. |
| `uniqueIDProperty` | `keyof T` | **Required.** Property that uniquely identifies each node. |
| `labelProperty` | `keyof T` | **Required.** Property holding the node's label. |
| `childrenProperty` | `keyof T` | **Required.** Property holding the node's children. |
| `valueProperty` | `keyof T` | Property holding the checked state. Without it, the tree is display-only. |
| `disabledProperty` | `keyof T` | Property that marks a node as disabled. |
| `onChange` | `(data: T[]) => void` | Called with the updated tree whenever a selection changes. |
| `chainedSelect` | `boolean` | Default `true`. Selection flows to descendants and parents reflect their children. |
| `defaultExpanded` | `boolean` | Default `false`. Whether nodes start expanded. |

## Customization

TreeSelect is made of four replaceable parts:

- `TreeNode`: the container for a node and its nested nodes
- `NodeLabel`: the label displayed in each node
- `NodeCheck`: the checkbox that selects a node or shows its descendants' selection
- `ExpandIcon`: the icon that shows whether a node with children is expanded or collapsed

Style them with `nodeClassName`, `labelClassName`, `inputClassName` and `iconClassName`, or replace them with `CustomNodeComponent`, `CustomLabelComponent`, `CustomCheckComponent` and `CustomExpandIconComponent`. A custom `TreeNode` should spread `treeItemProps` onto its root element and render `children` (the nested nodes) so keyboard navigation keeps working:

```tsx
const MyNode = (props: TreeNodeProps<Category>) => {
  const { standardComponentProps, treeItemProps, expanded, onExpandedChange, children } = props;

  return (
    <div {...treeItemProps}>
      <button onClick={() => onExpandedChange?.(!expanded)}>{standardComponentProps.node.label}</button>
      {children && <div role='group'>{children}</div>}
    </div>
  );
};
```

See [Customization](https://rts.attebyte.io/docs/customization) and the [examples](https://rts.attebyte.io/docs/examples).

## Accessibility

Give each tree an accessible name with `aria-label` or `aria-labelledby`. The tree is a single tab stop. Once it has focus:

| Key | Action |
| --- | --- |
| <kbd>↓</kbd> / <kbd>↑</kbd> | Move to the next or previous visible node |
| <kbd>→</kbd> | Expand a collapsed node, or move to the first child of an expanded node |
| <kbd>←</kbd> | Collapse an expanded node, or move to the parent node |
| <kbd>Home</kbd> / <kbd>End</kbd> | Move to the first or last visible node |
| <kbd>Space</kbd> | Check or uncheck the node |
| <kbd>Enter</kbd> | Activate the node, the same as clicking its label |

See [Accessibility](https://rts.attebyte.io/docs/accessibility).

## Upgrading from 1.x

Version 2.0 contains breaking changes:

- **Controlled mode is now fully controlled.** When you pass `data`, the tree renders exactly that data, so selections only appear once you pass the tree from `onChange` back in as `data`. Previously the tree kept its own copy and updated it even if you ignored `onChange`. If you don't want to manage the state yourself, use `defaultData`.
- **Parents with disabled children are mixed, not checked.** With chained selection, checking a parent whose disabled child is unchecked now makes the parent mixed (`null`) instead of checked, so its value always reflects its subtree. Clicking it again unchecks its enabled descendants. A parent whose descendants are all disabled is now shown as disabled, since it can never change (in 1.x it could be checked on its own).
- **`onChange` receives a structurally shared tree, and is only called when something changed.** Changed nodes and their ancestors are new objects, and every other node is the same object as before. Previously every change produced a full deep copy. Your input data is still never modified.
- **Nodes no longer contain a `_parentID` property.** Custom components that read `node._parentID` must track parents themselves.
- **Expansion state is managed by `TreeSelect`.** `TreeNode` now receives `expanded`, `onExpandedChange`, `treeItemProps`, and its nested nodes as `children`, instead of managing its own state and rendering its children itself. Custom node components that manage their own expansion and render their own children still work, but they aren't part of keyboard navigation unless they spread `treeItemProps` and render `children`. If such a component spreads its remaining props onto a DOM element, destructure `treeItemProps`, `expanded`, `onExpandedChange` and `children` first.
- **Changing `defaultExpanded` after the first render** now expands or collapses every node. Previously it only affected nodes rendered afterward.
- **New DOM structure and ARIA roles.** The root element has `role="tree"`, each node has `role="treeitem"`, and nested nodes are wrapped in a `role="group"` element. The label no longer has `role="button"`, the checkbox is removed from the tab order (the tree item carries its checked state), and the expand icon is hidden from assistive technology. Update any CSS selectors that relied on child nodes being direct children of their parent node.
- **The stylesheet no longer resets global styles.** Version 1.x shipped Tailwind's Preflight reset, which changed the styles of the entire page. If your app relied on that reset, include one yourself (for example, Tailwind's `@import "tailwindcss"`).
- **Styles are built with Tailwind CSS 4.** The default styles need Safari 16.4+, Chrome 111+ or Firefox 128+. Class names are merged with tailwind-merge 3, which understands Tailwind 4 class names; if you style the tree with Tailwind 3, overrides that use utilities renamed in Tailwind 4 (such as `rounded-sm` or `outline-none`) may not replace the defaults.
- **Package exports are restricted.** The package now defines `exports`, so only the main entry point and the stylesheet can be imported. Import styles from `@attebyte/react-tree-select/style.css`. The old `@attebyte/react-tree-select/dist/style.css` path still works.
- **The license changed from GPL-3.0 to MIT.**

### Fixes and improvements

- Keyboard navigation and screen reader support following the WAI-ARIA tree view pattern.
- New `getSelectedIDs` and `getSelectedNodes` helpers.
- Each selection change now updates only the affected nodes, and unchanged nodes skip re-rendering. Previously, every change cloned the entire tree and re-rendered every node.
- Expanding or collapsing a parent keeps the expansion state of its descendants.
- Nodes may contain values that cannot be cloned, such as functions or class instances. Previously, these caused an error.
- Several `onChange` calls from a custom component in one event (for example, "select all children") now combine instead of overwriting each other.
- Controlled data renders on the first render and during server-side rendering, instead of after an effect.
- The checkbox sets its `indeterminate` state for partially selected nodes and scales with the surrounding font size.
- `NodeLabel` no longer passes `label` and `disabled` through to the DOM.
- A warning is logged when several nodes share the same ID.
- A custom component can call `onChange(node, value)` as a plain setter, or pass `{ toggle: true }` to get the same behavior as a click.
- Labels that are not text (such as React elements) are no longer turned into "[object Object]" as the accessible name.
- The bundle no longer includes `clsx`, `class-variance-authority`, and `tailwind-merge`, which are installed as dependencies. This reduces `main.js` from 69 KB to 17 KB.
- The stylesheet only contains the component's own styles (3 KB, down from 14 KB).
- Type declarations are bundled into a single file, so they also work with `"moduleResolution": "node16"` or `"nodenext"`, and the package can be loaded with `require()` in Node.js and Jest.

## Development

```sh
npm install
npm run storybook        # Storybook at http://localhost:6006
npm test                 # unit tests (watch mode)
npm run test:storybook   # stories with interaction and accessibility checks in a real browser
npm run lint
npm run build            # library to dist/
npm run build-site       # library, Storybook and the documentation site
```

The documentation site lives in [`website/`](./website) (Docusaurus), and the examples it shares with Storybook live in [`examples/`](./examples).

## License

[MIT](./LICENSE) © Attebyte LLC

<br/>

<a href="https://www.buymeacoffee.com/tristan10" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://firebasestorage.googleapis.com/v0/b/attebyte-8542f.appspot.com/o/react-tree-select%2Fbmc-logo-light.svg?alt=media&token=03a8ffd4-3e98-4c8e-9e7a-b8c200c92ed6">
    <img src="https://firebasestorage.googleapis.com/v0/b/attebyte-8542f.appspot.com/o/react-tree-select%2Fbmc-logo.svg?alt=media&token=357749a8-a191-46de-88f4-b7783517b806" alt="Buy Me A Coffee" title="Buy Me A Coffee" height="40" />
  </picture>
</a>

This is my first open-source project, and feedback is always appreciated. [Twitter](https://twitter.com/tristanattebery)
