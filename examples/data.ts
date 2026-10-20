export interface ExampleNode {
  label: string;
  value: number;
  included?: boolean | null;
  disabled?: boolean;
  children?: ExampleNode[];
}

export const exampleData: ExampleNode[] = [
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

// A copy with 'Child 1' disabled, so examples can show disabled nodes without changing the shared data
export const exampleDataWithDisabled: ExampleNode[] = structuredClone(exampleData);
exampleDataWithDisabled[0].children![0].disabled = true;

export interface Comment {
  name: string;
  value: number;
  imageURL?: string;
  comment: string;
  children?: Comment[];
}

const headshot1 = 'https://firebasestorage.googleapis.com/v0/b/attebyte-8542f.appspot.com/o/react-tree-select%2Fheadshot1.png?alt=media&token=a272c183-47af-44b6-8be0-05dfaac7bc0d';
const headshot2 = 'https://firebasestorage.googleapis.com/v0/b/attebyte-8542f.appspot.com/o/react-tree-select%2Fheadshot2.png?alt=media&token=3d08ea5d-a216-4ca3-ab0d-aa2d1d66cf4b';
const headshot3 = 'https://firebasestorage.googleapis.com/v0/b/attebyte-8542f.appspot.com/o/react-tree-select%2Fheadshot3.png?alt=media&token=7519573c-5550-44b0-932f-0378a3eae146';

export const commentData: Comment[] = [
  {
    name: 'John Doe',
    value: 1,
    imageURL: headshot1,
    comment: 'Wow, this is a great post!',
    children: [
      {
        name: 'Jane Doe',
        value: 2,
        imageURL: '',
        comment: 'I agree, this is a great post!',
        children: [
          { name: 'John Doe', value: 3, imageURL: headshot1, comment: 'Thanks, I appreciate the feedback!' }
        ]
      }
    ]
  },
  {
    name: 'Andrew Smith',
    value: 4,
    imageURL: headshot2,
    comment: 'I disagree, this is a terrible post!',
    children: [
      { name: 'John Doe', value: 5, imageURL: headshot1, comment: 'I appreciate the feedback, but I disagree!' }
    ]
  },
  {
    name: 'Jane Smith',
    value: 6,
    imageURL: headshot3,
    comment: 'My opinion matters more than yours!'
  }
];

// Builds a tree with breadths[0] roots, breadths[1] children per root, and so on. IDs are unique across the tree.
export function generateTree(breadths: number[]): ExampleNode[] {
  let nextID = 1;
  const build = (level: number, path: string): ExampleNode[] => Array.from({ length: breadths[level] }, (_, index) => {
    const label = path ? `${path}.${index + 1}` : `${index + 1}`;
    return {
      label: `Item ${label}`,
      value: nextID++,
      children: level + 1 < breadths.length ? build(level + 1, label) : undefined
    };
  });
  return build(0, '');
}
