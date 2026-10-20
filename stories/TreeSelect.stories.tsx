import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, spyOn, userEvent, within } from 'storybook/test';
import TreeSelect, { TreeSelectProps } from '@attebyte/react-tree-select';
import { exampleDataWithDisabled, ExampleNode } from '../examples/data';
import BasicExample from '../examples/BasicExample';
import ControlledExample from '../examples/ControlledExample';
import BasicPropsExample from '../examples/BasicPropsExample';
import DisabledNodesExample from '../examples/DisabledNodesExample';
import StylingExample from '../examples/StylingExample';
import CustomIconExample from '../examples/CustomIconExample';
import CustomCheckExample from '../examples/CustomCheckExample';
import CustomNodeExample from '../examples/CustomNodeExample';
import LargeTreeExample from '../examples/LargeTreeExample';

const meta = {
  title: 'TreeSelect',
  component: TreeSelect<ExampleNode>,
  parameters: {
    docs: {
      description: {
        component: 'An accessible React tree select (checkbox tree) with tri-state selection, keyboard navigation and replaceable parts. Full documentation: https://rts.attebyte.io'
      }
    }
  },
  args: {
    defaultData: exampleDataWithDisabled,
    uniqueIDProperty: 'value',
    labelProperty: 'label',
    childrenProperty: 'children',
    valueProperty: 'included',
    disabledProperty: 'disabled',
    disabled: false,
    defaultExpanded: true,
    chainedSelect: true,
    expandDisabledNodes: true,
    'aria-label': 'Playground tree',
    onChange: fn()
  },
  argTypes: {
    defaultData: { control: false },
    data: { control: false },
    disabled: { control: 'boolean', description: 'Disable every node.' },
    defaultExpanded: { control: 'boolean', description: 'Start with every node expanded. Changing it expands or collapses every node.' },
    chainedSelect: { control: 'boolean', description: 'Selecting a parent selects its enabled descendants, and parents show the state of their children.' },
    expandDisabledNodes: { control: 'boolean', description: 'Allow disabled nodes to be expanded and collapsed.' }
  }
} satisfies Meta<TreeSelectProps<ExampleNode>>;

export default meta;
type Story = StoryObj<typeof meta>;

const tree = (canvasElement: HTMLElement) => within(canvasElement);

// Every prop as a control. 'Child 1' is disabled.
export const Playground: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = tree(canvasElement);
    const root = canvas.getByRole('treeitem', { name: 'Root 2' });

    await userEvent.click(within(root).getByText('Child 3'));
    await expect(canvas.getByRole('treeitem', { name: 'Child 3' })).toHaveAttribute('aria-checked', 'true');
    await expect(root).toHaveAttribute('aria-checked', 'mixed');
    await expect(args.onChange).toHaveBeenCalled();
  }
};

export const Basic: Story = {
  render: () => <BasicExample />,
  play: async ({ canvasElement }) => {
    const canvas = tree(canvasElement);
    await userEvent.click(canvas.getByText('Root 1'));
    await expect(canvas.getByRole('treeitem', { name: 'Root 1' })).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('treeitem', { name: 'Child 1' })).toBeVisible();
  }
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
  play: async ({ canvasElement }) => {
    const canvas = tree(canvasElement);
    await userEvent.click(canvas.getByText('Child 1'));
    await userEvent.click(canvas.getByRole('treeitem', { name: 'Root 1' }).querySelector('input')!);
    await expect(canvas.getByTestId('selected-ids')).toHaveTextContent('[3,4,5]');
  }
};

export const KeyboardNavigation: Story = {
  render: () => <BasicExample />,
  play: async ({ canvasElement }) => {
    const canvas = tree(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole('treeitem', { name: 'Root 1' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    await expect(canvas.getByRole('treeitem', { name: 'Child 1' })).toHaveFocus();
    await userEvent.keyboard(' ');
    await expect(canvas.getByRole('treeitem', { name: 'Child 1' })).toHaveAttribute('aria-checked', 'true');
    await expect(canvas.getByRole('treeitem', { name: 'Root 1' })).toHaveAttribute('aria-checked', 'mixed');
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    await expect(canvas.getByRole('treeitem', { name: 'Root 1' })).toHaveFocus();
  }
};

export const BasicProps: Story = {
  render: () => <BasicPropsExample />
};

export const DisabledNodes: Story = {
  render: () => <DisabledNodesExample />,
  play: async ({ canvasElement }) => {
    const canvas = tree(canvasElement);
    const root = canvas.getByRole('treeitem', { name: 'Root 1' });
    const checkbox = root.querySelector('input')!;

    await userEvent.click(checkbox);
    await expect(root).toHaveAttribute('aria-checked', 'mixed');
    await expect(canvas.getByRole('treeitem', { name: 'Child 2' })).toHaveAttribute('aria-checked', 'true');

    // Everything that can change is checked, so checking again unchecks it
    await userEvent.click(checkbox);
    await expect(root).toHaveAttribute('aria-checked', 'false');
  }
};

export const Styling: Story = {
  render: () => <StylingExample />
};

export const CustomIcon: Story = {
  render: () => <CustomIconExample />
};

export const FileTree: Story = {
  render: () => <CustomCheckExample />
};

export const CommentThread: Story = {
  render: () => <CustomNodeExample />,
  play: async ({ canvasElement }) => {
    const canvas = tree(canvasElement);
    await userEvent.click(canvas.getAllByText('Show replies')[0]);
    await expect(canvas.getByRole('treeitem', { name: 'Jane Doe' })).toBeVisible();
  }
};

export const LargeTree: Story = {
  render: () => <LargeTreeExample />,
  beforeEach: () => {
    const warn = spyOn(console, 'warn');
    return () => warn.mockRestore();
  },
  play: async ({ canvasElement }) => {
    const canvas = tree(canvasElement);
    // The library warns about duplicate IDs, which would break selection and keyboard navigation
    await expect(console.warn).not.toHaveBeenCalled();
    await userEvent.click(canvas.getByRole('treeitem', { name: 'Item 1' }).querySelector('input')!);
    await expect(canvas.getByText('Selected leaves: 2,000')).toBeVisible();
  }
};
