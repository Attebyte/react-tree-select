// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useState } from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import TreeSelect, { NodeLabelProps, TreeNodeProps, TreeSelectProps } from '../main';

interface Node {
  label: string;
  value: number;
  included?: boolean | null;
  disabled?: boolean;
  children?: Node[];
}

const createData = (): Node[] => [
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

type Props = Partial<TreeSelectProps<Node>>;

const renderTree = (props: Props = {}) => render(
  <TreeSelect<Node>
    defaultData={props.data ? undefined : createData()}
    uniqueIDProperty='value'
    labelProperty='label'
    childrenProperty='children'
    valueProperty='included'
    disabledProperty='disabled'
    aria-label='Example tree'
    {...props}
  />
);

const item = (name: string) => screen.getByRole('treeitem', { name });
const checkbox = (name: string) => item(name).querySelector('input') as HTMLInputElement;
const label = (name: string) => within(item(name)).getByText(name);
const queryItem = (name: string) => screen.queryByRole('treeitem', { name });

afterEach(cleanup);

describe('rendering', () => {
  test('renders an accessible tree, collapsed by default', () => {
    renderTree();
    expect(screen.getByRole('tree', { name: 'Example tree' })).toHaveProperty('ariaMultiSelectable', 'true');
    expect(screen.getAllByRole('treeitem').map(node => node.getAttribute('aria-label'))).toEqual(['Root 1', 'Root 2']);

    const root = item('Root 1');
    expect(root.getAttribute('aria-expanded')).toBe('false');
    expect(root.getAttribute('aria-level')).toBe('1');
    expect(root.getAttribute('aria-posinset')).toBe('1');
    expect(root.getAttribute('aria-setsize')).toBe('2');
    expect(root.getAttribute('aria-checked')).toBe('false');
  });

  test('clicking a label expands and collapses', async () => {
    const user = userEvent.setup();
    renderTree();

    await user.click(label('Root 1'));
    expect(item('Root 1').getAttribute('aria-expanded')).toBe('true');
    expect(item('Child 1').getAttribute('aria-level')).toBe('2');
    expect(within(item('Root 1')).getByRole('group')).toBeTruthy();

    await user.click(label('Root 1'));
    expect(queryItem('Child 1')).toBeNull();
  });

  test('defaultExpanded expands every node', () => {
    renderTree({ defaultExpanded: true });
    expect(item('Grandchild 2')).toBeTruthy();
    expect(item('Child 4')).toBeTruthy();
  });

  test('keeps descendant expansion when a parent is collapsed and reopened', async () => {
    const user = userEvent.setup();
    renderTree();

    await user.click(label('Root 1'));
    await user.click(label('Child 1'));
    await user.click(label('Root 1'));
    await user.click(label('Root 1'));
    expect(item('Grandchild 1')).toBeTruthy();
  });

  test('renders nothing for empty data', () => {
    renderTree({ data: [] });
    expect(screen.queryAllByRole('treeitem')).toHaveLength(0);
  });

  test('omits selection semantics without a value property', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderTree({ valueProperty: undefined, defaultExpanded: true, onChange });

    expect(screen.getByRole('tree').hasAttribute('aria-multiselectable')).toBe(false);
    expect(item('Child 2').hasAttribute('aria-checked')).toBe(false);
    await user.click(label('Child 2'));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('selection', () => {
  test('checking a parent cascades and reports the new tree', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const defaultData = createData();
    renderTree({ defaultData, onChange, defaultExpanded: true });

    await user.click(checkbox('Child 1'));

    expect(checkbox('Child 1').checked).toBe(true);
    expect(checkbox('Grandchild 1').checked).toBe(true);
    expect(checkbox('Grandchild 2').checked).toBe(true);
    expect(item('Root 1').getAttribute('aria-checked')).toBe('mixed');
    expect(checkbox('Root 1').indeterminate).toBe(true);

    const result: Node[] = onChange.mock.calls[0][0];
    expect(result[0].included).toBe(null);
    expect(result[0].children![0].included).toBe(true);
    expect(result[0].children![0].children![1].included).toBe(true);
    expect(JSON.stringify(result)).not.toContain('parentID');
    // Input data is never mutated
    expect(defaultData).toEqual(createData());
  });

  test('clicking a leaf label toggles it', async () => {
    const user = userEvent.setup();
    renderTree({ defaultExpanded: true });

    await user.click(label('Child 3'));
    expect(checkbox('Child 3').checked).toBe(true);
    await user.click(label('Child 3'));
    expect(checkbox('Child 3').checked).toBe(false);
  });

  test('selecting every child selects the parent', async () => {
    const user = userEvent.setup();
    renderTree({ defaultExpanded: true });

    await user.click(checkbox('Child 3'));
    expect(checkbox('Root 2').indeterminate).toBe(true);
    await user.click(checkbox('Child 4'));
    expect(checkbox('Root 2').checked).toBe(true);
    expect(checkbox('Root 2').indeterminate).toBe(false);
  });

  test('chainedSelect={false} selects nodes individually', async () => {
    const user = userEvent.setup();
    renderTree({ defaultExpanded: true, chainedSelect: false });

    await user.click(checkbox('Root 2'));
    expect(checkbox('Root 2').checked).toBe(true);
    expect(checkbox('Child 3').checked).toBe(false);
  });

  test('controlled data only changes when the parent updates it', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderTree({ data: createData(), defaultExpanded: true, onChange });

    await user.click(checkbox('Child 3'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0][1].children[0].included).toBe(true);
    expect(checkbox('Child 3').checked).toBe(false);
  });

  test('controlled data reflects parent state', async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [data, setData] = useState(createData);
      return (
        <>
          <TreeSelect<Node>
            data={data}
            onChange={setData}
            uniqueIDProperty='value'
            labelProperty='label'
            childrenProperty='children'
            valueProperty='included'
            defaultExpanded
          />
          <button onClick={() => setData(createData())}>reset</button>
        </>
      );
    };
    render(<Controlled />);

    await user.click(checkbox('Root 2'));
    expect(checkbox('Child 4').checked).toBe(true);

    await user.click(screen.getByText('reset'));
    expect(checkbox('Child 4').checked).toBe(false);
    expect(checkbox('Root 2').checked).toBe(false);
  });

  test('accepts nodes with values structuredClone cannot copy', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const handler = () => undefined;
    const data = createData().map(node => ({ ...node, handler }));
    render(
      <TreeSelect
        defaultData={data}
        uniqueIDProperty='value'
        labelProperty='label'
        childrenProperty='children'
        valueProperty='included'
        onChange={onChange}
      />
    );

    await user.click(checkbox('Root 1'));
    expect(onChange.mock.calls[0][0][0].handler).toBe(handler);
  });
});

describe('disabled nodes', () => {
  const withDisabledChild = () => {
    const data = createData();
    data[0].children![0].disabled = true;
    return data;
  };

  test('disabled nodes cannot be selected and disable their children when chained', async () => {
    const user = userEvent.setup();
    renderTree({ defaultData: withDisabledChild(), defaultExpanded: true });

    expect(checkbox('Child 1').disabled).toBe(true);
    expect(item('Child 1').getAttribute('aria-disabled')).toBe('true');
    expect(checkbox('Grandchild 1').disabled).toBe(true);

    await user.click(label('Grandchild 1'));
    expect(checkbox('Grandchild 1').checked).toBe(false);

    // Selecting the root skips the disabled branch
    await user.click(checkbox('Root 1'));
    expect(checkbox('Child 2').checked).toBe(true);
    expect(checkbox('Child 1').checked).toBe(false);
    expect(checkbox('Grandchild 1').checked).toBe(false);
  });

  test('children of disabled nodes stay enabled when unchained', () => {
    renderTree({ defaultData: withDisabledChild(), defaultExpanded: true, chainedSelect: false });
    expect(checkbox('Child 1').disabled).toBe(true);
    expect(checkbox('Grandchild 1').disabled).toBe(false);
  });

  test('expandDisabledNodes={false} prevents expanding disabled nodes', async () => {
    const user = userEvent.setup();
    renderTree({ defaultData: withDisabledChild(), expandDisabledNodes: false });

    await user.click(label('Root 1'));
    await user.click(label('Child 1'));
    expect(queryItem('Grandchild 1')).toBeNull();
  });

  test('disabled nodes can be expanded by default', async () => {
    const user = userEvent.setup();
    renderTree({ defaultData: withDisabledChild() });

    await user.click(label('Root 1'));
    await user.click(label('Child 1'));
    expect(item('Grandchild 1')).toBeTruthy();
  });

  test('disabled disables the whole tree', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderTree({ disabled: true, defaultExpanded: true, onChange });

    expect(screen.getAllByRole('treeitem').every(node => node.getAttribute('aria-disabled') === 'true')).toBe(true);
    await user.click(label('Child 4'));
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('keyboard', () => {
  test('the tree has exactly one tab stop', async () => {
    const user = userEvent.setup();
    renderTree({ defaultExpanded: true });

    const tabbable = screen.getAllByRole('treeitem').filter(node => node.tabIndex === 0);
    expect(tabbable).toHaveLength(1);
    expect(tabbable[0]).toBe(item('Root 1'));
    expect(checkbox('Root 1').tabIndex).toBe(-1);

    await user.tab();
    expect(document.activeElement).toBe(item('Root 1'));
  });

  test('arrow keys, Home and End move through visible nodes', async () => {
    const user = userEvent.setup();
    renderTree();

    await user.tab();
    await user.keyboard('{ArrowDown}');
    expect(document.activeElement).toBe(item('Root 2'));
    await user.keyboard('{ArrowUp}');
    expect(document.activeElement).toBe(item('Root 1'));

    // Right expands, then moves to the first child
    await user.keyboard('{ArrowRight}');
    expect(item('Root 1').getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(item('Root 1'));
    await user.keyboard('{ArrowRight}');
    expect(document.activeElement).toBe(item('Child 1'));

    await user.keyboard('{End}');
    expect(document.activeElement).toBe(item('Root 2'));
    await user.keyboard('{Home}');
    expect(document.activeElement).toBe(item('Root 1'));

    // Roving tab index follows focus
    expect(item('Root 1').tabIndex).toBe(0);
    expect(item('Root 2').tabIndex).toBe(-1);
  });

  test('left collapses, then moves to the parent', async () => {
    const user = userEvent.setup();
    renderTree({ defaultExpanded: true });

    act(() => item('Grandchild 1').focus());
    await user.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(item('Child 1'));
    await user.keyboard('{ArrowLeft}');
    expect(item('Child 1').getAttribute('aria-expanded')).toBe('false');
    await user.keyboard('{ArrowLeft}');
    expect(document.activeElement).toBe(item('Root 1'));
  });

  test('space toggles selection and enter activates like a label click', async () => {
    const user = userEvent.setup();
    renderTree({ defaultExpanded: true });

    act(() => item('Root 2').focus());
    await user.keyboard(' ');
    expect(item('Root 2').getAttribute('aria-checked')).toBe('true');
    expect(checkbox('Child 3').checked).toBe(true);

    await user.keyboard('{Enter}');
    expect(item('Root 2').getAttribute('aria-expanded')).toBe('false');

    act(() => item('Child 2').focus());
    await user.keyboard('{Enter}');
    expect(item('Child 2').getAttribute('aria-checked')).toBe('true');
  });

  test('keyboard respects disabled nodes', async () => {
    const user = userEvent.setup();
    const data = createData();
    data[1].disabled = true;
    renderTree({ defaultData: data, expandDisabledNodes: false });

    act(() => item('Root 2').focus());
    await user.keyboard(' ');
    expect(item('Root 2').getAttribute('aria-checked')).toBe('false');
    await user.keyboard('{ArrowRight}');
    expect(item('Root 2').getAttribute('aria-expanded')).toBe('false');
  });

  test('collapsing a parent moves focus off the hidden descendant', async () => {
    const user = userEvent.setup();
    renderTree({ defaultExpanded: true });

    act(() => item('Grandchild 2').focus());
    await user.click(label('Root 1'));
    expect(queryItem('Grandchild 2')).toBeNull();
    expect(screen.getAllByRole('treeitem').filter(node => node.tabIndex === 0)).toEqual([item('Root 1')]);
  });

  test('a tab stop remains when the active node is removed', () => {
    const { rerender } = render(
      <TreeSelect<Node> data={createData()} uniqueIDProperty='value' labelProperty='label' childrenProperty='children' />
    );
    act(() => item('Root 2').focus());
    rerender(
      <TreeSelect<Node> data={createData().slice(0, 1)} uniqueIDProperty='value' labelProperty='label' childrenProperty='children' />
    );
    expect(item('Root 1').tabIndex).toBe(0);
  });

  test('clicking a checkbox focuses its tree item', () => {
    renderTree({ defaultExpanded: true });
    const input = checkbox('Child 3');
    const notPrevented = fireEvent.mouseDown(input);
    expect(notPrevented).toBe(false);
    expect(document.activeElement).toBe(item('Child 3'));
  });

  test('consumer key handlers run first and can opt out', async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn((e: React.KeyboardEvent) => e.preventDefault());
    renderTree({ onKeyDown });

    await user.tab();
    await user.keyboard('{ArrowDown}');
    expect(onKeyDown).toHaveBeenCalled();
    expect(document.activeElement).toBe(item('Root 1'));
  });
});

describe('customization', () => {
  test('class names and styles reach each part', () => {
    renderTree({
      defaultExpanded: true,
      nodeClassName: 'my-node',
      labelClassName: 'my-label ps-6',
      inputClassName: 'my-input',
      iconClassName: 'my-icon',
      labelStyle: { color: 'red' }
    });

    expect(item('Root 1').className).toContain('my-node');
    expect(label('Root 1').className).toContain('my-label');
    // tailwind-merge lets consumer classes override the defaults
    expect(label('Root 1').className).not.toMatch(/\bps-3\b/);
    expect(label('Root 1').style.color).toBe('red');
    expect(checkbox('Root 1').className).toContain('my-input');
    expect(label('Root 1').querySelector('[aria-hidden="true"]')?.className).toContain('my-icon');
  });

  test('custom check, label and icon components receive node props', async () => {
    const user = userEvent.setup();
    const CustomCheck = vi.fn(() => <span>check</span>);
    const CustomIcon = vi.fn(() => null);
    const CustomLabel = (props: NodeLabelProps<Node>) => (
      <span onClick={props.onClick}>{`custom ${props.label}`}</span>
    );

    renderTree({ CustomCheckComponent: CustomCheck, CustomLabelComponent: CustomLabel, CustomExpandIconComponent: CustomIcon });
    await user.click(screen.getByText('custom Root 1'));

    expect(screen.getByText('custom Child 1')).toBeTruthy();
    const checkProps = (CustomCheck.mock.calls as unknown as [Record<string, unknown>][]).at(-1)![0];
    expect(checkProps).toHaveProperty('standardComponentProps');
    expect(checkProps).toHaveProperty('checked');
  });

  test('custom node components can render children and tree item props', async () => {
    const user = userEvent.setup();
    const CustomNode = (props: TreeNodeProps<Node>) => (
      <div {...props.treeItemProps}>
        <button onClick={() => props.onExpandedChange?.(!props.expanded)}>{`toggle ${props.standardComponentProps.node.label}`}</button>
        {props.children}
      </div>
    );

    renderTree({ CustomNodeComponent: CustomNode });
    await user.click(screen.getByText('toggle Root 1'));
    expect(item('Child 1')).toBeTruthy();
    expect(item('Root 1').getAttribute('aria-expanded')).toBe('true');
  });

  test('custom node components that manage their own children still work', async () => {
    const user = userEvent.setup();
    const SelfRendering = (props: TreeNodeProps<Node>) => {
      const [open, setOpen] = useState(false);
      const { node } = props.standardComponentProps;
      return (
        <div>
          <span onClick={() => setOpen(!open)}>{node.label}</span>
          {open && node.children?.map(child => (
            <SelfRendering key={child.value} {...props} standardComponentProps={{ ...props.standardComponentProps, node: child }} />
          ))}
        </div>
      );
    };

    renderTree({ CustomNodeComponent: SelfRendering });
    await user.click(screen.getByText('Root 1'));
    expect(screen.getByText('Child 1')).toBeTruthy();
  });
});

describe('rendering performance', () => {
  test('changing one branch does not re-render unrelated nodes', async () => {
    const user = userEvent.setup();
    const renders = new Map<string, number>();
    const CountingLabel = (props: NodeLabelProps<Node>) => {
      renders.set(props.label, (renders.get(props.label) ?? 0) + 1);
      return <span onClick={props.onClick}>{props.label}</span>;
    };

    renderTree({ defaultExpanded: true, CustomLabelComponent: CountingLabel });
    // Moving the tab stop legitimately re-renders the old and new active nodes, so do it first
    act(() => item('Child 3').focus());
    const before = new Map(renders);

    await user.click(checkbox('Child 3'));
    expect(renders.get('Child 3')).toBeGreaterThan(before.get('Child 3')!);
    expect(renders.get('Root 2')).toBeGreaterThan(before.get('Root 2')!);
    expect(renders.get('Root 1')).toBe(before.get('Root 1'));
    expect(renders.get('Grandchild 1')).toBe(before.get('Grandchild 1'));
    expect(renders.get('Child 4')).toBe(before.get('Child 4'));
  });
});

describe('review fixes', () => {
  test('several onChange calls in one event compose', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const SelectChildren = (props: TreeNodeProps<Node>) => {
      const { node } = props.standardComponentProps;
      return (
        <div {...props.treeItemProps}>
          <button onClick={() => node.children?.forEach(child => props.onChange(child, true))}>{`select ${node.label}`}</button>
          {props.children}
        </div>
      );
    };

    renderTree({ CustomNodeComponent: SelectChildren, onChange });
    await user.click(screen.getByText('select Root 2'));

    const result: Node[] = onChange.mock.calls.at(-1)![0];
    expect(result[1].children!.map(child => child.included)).toEqual([true, true]);
    expect(result[1].included).toBe(true);
  });

  test('a checkbox click after an ignored controlled change starts from the rendered data', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderTree({ data: createData(), defaultExpanded: true, onChange });

    await user.click(checkbox('Child 3'));
    await user.click(checkbox('Child 4'));
    const result: Node[] = onChange.mock.calls[1][0];
    expect(result[1].children![0].included).toBe(undefined);
    expect(result[1].children![1].included).toBe(true);
  });

  test('modified keys are left to the browser', async () => {
    const user = userEvent.setup();
    renderTree({ defaultExpanded: true });

    act(() => item('Child 1').focus());
    await user.keyboard('{Alt>}{ArrowLeft}{/Alt}');
    expect(item('Child 1').getAttribute('aria-expanded')).toBe('true');
    await user.keyboard('{Control>}{Home}{/Control}');
    expect(document.activeElement).toBe(item('Child 1'));
  });

  test('changing defaultExpanded expands or collapses every node', async () => {
    const user = userEvent.setup();
    const { rerender } = renderTree();
    await user.click(label('Root 1'));
    expect(item('Child 1')).toBeTruthy();

    const props = { defaultData: createData(), uniqueIDProperty: 'value', labelProperty: 'label', childrenProperty: 'children', valueProperty: 'included' } as const;
    rerender(<TreeSelect<Node> {...props} defaultExpanded />);
    expect(item('Grandchild 1')).toBeTruthy();
    expect(item('Child 4')).toBeTruthy();

    rerender(<TreeSelect<Node> {...props} defaultExpanded={false} />);
    expect(queryItem('Child 1')).toBeNull();
  });

  test('warns once about duplicate IDs', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const data = createData();
    data[1].children![0].value = 2;
    renderTree({ data });
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain('value (2)');
    warn.mockRestore();
  });

  test('the default checkbox stays focusable and labelled in a custom node without tree item props', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const PlainNode = (props: TreeNodeProps<Node>) => (
      <div>
        <props.CheckComponent
          standardComponentProps={props.standardComponentProps}
          checked={props.standardComponentProps.node.included}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.onChange(props.standardComponentProps.node, e.target.checked)}
        />
      </div>
    );

    renderTree({ CustomNodeComponent: PlainNode, onChange });
    const input = screen.getByRole('checkbox', { name: 'Root 1' });
    expect(input.tabIndex).toBe(0);
    expect(input.hasAttribute('aria-hidden')).toBe(false);

    await user.tab();
    expect(document.activeElement).toBe(input);
    await user.keyboard(' ');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test('a mixed parent with a disabled child toggles instead of getting stuck', async () => {
    const user = userEvent.setup();
    const data = createData();
    data[1].children![0].disabled = true;
    renderTree({ defaultData: data, defaultExpanded: true });

    await user.click(checkbox('Root 2'));
    expect(item('Root 2').getAttribute('aria-checked')).toBe('mixed');
    expect(checkbox('Child 4').checked).toBe(true);

    await user.click(checkbox('Root 2'));
    expect(item('Root 2').getAttribute('aria-checked')).toBe('false');
    expect(checkbox('Child 4').checked).toBe(false);
  });

  test('the checkbox inherits the surrounding font size', () => {
    renderTree();
    expect(checkbox('Root 1').className).toContain('[font:inherit]');
  });
});

describe('round 2 review fixes', () => {
  test('a parent whose children are all disabled is disabled and never reports a change', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const data = createData();
    data[1].children!.forEach(child => child.disabled = true);
    renderTree({ defaultData: data, defaultExpanded: true, onChange });

    expect(item('Root 2').getAttribute('aria-disabled')).toBe('true');
    expect(checkbox('Root 2').disabled).toBe(true);
    await user.click(label('Root 2'));
    act(() => item('Root 2').focus());
    await user.keyboard(' ');
    expect(onChange).not.toHaveBeenCalled();
    // It can still be expanded and collapsed
    expect(item('Root 2').getAttribute('aria-expanded')).toBe('false');
  });

  test('onChange is not called when nothing changes', () => {
    const onChange = vi.fn();
    let change: TreeNodeProps<Node>['onChange'] = () => undefined;
    const Capture = (props: TreeNodeProps<Node>) => {
      change = props.onChange;
      return <div {...props.treeItemProps}>{props.standardComponentProps.node.label}</div>;
    };
    const data = createData();
    renderTree({ data, onChange, CustomNodeComponent: Capture });

    // Child 2 is already unchecked, so unchecking it changes nothing
    act(() => change(data[0].children![1], false));
    expect(onChange).not.toHaveBeenCalled();
  });

  test('labels that are not text do not become the accessible name', () => {
    const data = [{ id: 1, name: <em>Fancy</em> }];
    render(<TreeSelect data={data} uniqueIDProperty='id' labelProperty='name' childrenProperty={'kids' as 'id'} />);
    expect(screen.getByRole('treeitem').hasAttribute('aria-label')).toBe(false);
  });
});
