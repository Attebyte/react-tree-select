export default interface ExampleNode {
  label: string;
  value: number;
  included?: boolean | null;
  disabled?: boolean;
  children?: ExampleNode[];
}