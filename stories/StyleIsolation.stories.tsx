import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import TreeSelect from '@attebyte/react-tree-select';
import { exampleData, ExampleNode } from '../examples/data';

// Regression tests for the library stylesheet's effect on the app around it. Hidden from the sidebar.
const meta = {
  title: 'Tests/Style isolation',
  tags: ['!dev', '!autodocs']
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AppStylesWin: Story = {
  render: () => (
    <div className='flex flex-wrap'>
      {/* An app element that shares class names with the library's defaults. The always-on max-* variant
          must win over basis-full, as a responsive variant like lg:basis-96 would. */}
      <div data-testid='card' className='basis-full max-[100000px]:basis-1/2'>Card</div>
      <TreeSelect<ExampleNode>
        defaultData={exampleData}
        uniqueIDProperty='value'
        labelProperty='label'
        childrenProperty='children'
        valueProperty='included'
        labelClassName='ps-6'
        inputClassName='w-8 h-8'
        aria-label='Isolation tree'
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The library's rules don't match or outrank the app's own classes
    await expect(getComputedStyle(canvas.getByTestId('card')).flexBasis).toBe('50%');

    // App classes passed to the tree override its defaults
    const root = canvas.getByRole('treeitem', { name: 'Root 1' });
    const label = within(root).getByText('Root 1');
    await expect(getComputedStyle(label).paddingInlineStart).toBe('24px');
    await expect(getComputedStyle(root.querySelector('input')!).width).toBe('32px');
  }
};
