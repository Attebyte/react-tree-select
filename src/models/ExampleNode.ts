export default interface ExampleNode {
  label: string;
  value: number;
  included?: boolean | null;
  children?: ExampleNode[];
}