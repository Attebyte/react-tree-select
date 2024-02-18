
export class TreeUtility {
  static initializeTree<T>(tree: T[], parentIDProperty: keyof T, childrenProperty: keyof T, uniqueIDProperty: keyof T): void {
    // Set the parent ID for all nodes
    this.setParentID(tree, parentIDProperty, childrenProperty, uniqueIDProperty);
  }

  private static setParentID<T>(tree: T[], parentIDProperty: keyof T, childrenProperty: keyof T, uniqueIDProperty: keyof T, parentNode?: T): void {
    tree.forEach(node => {
      (node[parentIDProperty] as any) = parentNode ? parentNode[uniqueIDProperty] : undefined;
      if (node[childrenProperty] && Array.isArray(node[childrenProperty])) {
        this.setParentID(node[childrenProperty] as T[], parentIDProperty, childrenProperty, uniqueIDProperty, node);
      }
    });
  }

  static omitParentID<T extends { _parentID?: any }>(tree: T[], childrenProperty: keyof Omit<T, '_parentID'>): Omit<T, '_parentID'>[] {
    return tree.map(node => {
      const { _parentID, ...rest } = node; // Destructure to omit parentID
      if (node[childrenProperty] && Array.isArray(node[childrenProperty])) {
        // If there are children, recursively omit their parentID too
        rest[childrenProperty] = this.omitParentID(node[childrenProperty] as T[], childrenProperty as keyof Omit<T, '_parentID'>) as T[Exclude<keyof T, "_parentID">]; // Explicit casting
      }
      return rest;
    });
  }

  // Perform a breadth-first search to find a node in the tree
  static getNode<T>(tree: T[], childrenProperty: keyof T, uniqueIDProperty: keyof T, uniqueValue: any): T | undefined {

    // Initialize queue for BFS
    const queue: T[] = [...tree];

    while (queue.length > 0) {
      const currentNode = queue.shift()!;
      if (currentNode[uniqueIDProperty] === uniqueValue) {
        return currentNode;
      }

      // If the current node has children, enqueue them for searching
      const childrenNodes: T[] = (currentNode[childrenProperty] as any) || [];
      if (childrenNodes.length > 0) {
        queue.push(...childrenNodes);
      }
    }

    return undefined;
  }

  static chainUpdate<T>(tree: T[], startingNode: T, parentIDProperty: keyof T, childrenProperty: keyof T, valueProperty: keyof T, uniqueIDProperty: keyof T, newValue: boolean | null, disabledProperty?: keyof T): void {

    // Update node and its children
    const updateNodeAndChildren = (node: T, newValue: boolean | null): void => {
      if (disabledProperty && node[disabledProperty] === true) return; // Stop if the node is disabled
      node[valueProperty] = newValue as NonNullable<T>[keyof T];
      const children: T[] = node[childrenProperty] as T[];
      if (children) {
        children.forEach(child => updateNodeAndChildren(child, newValue));
      }
    };

    const updateParentBasedOnSiblings = (node: T): void => {

      if (node[parentIDProperty] === undefined) return; // Stop if there's no parent

      const parentNode = this.getNode(tree, childrenProperty, uniqueIDProperty, node[parentIDProperty]);
      if (!parentNode || !(parentNode[childrenProperty] as any)) return;

      const siblings: T[] = parentNode[childrenProperty] as T[];
      const valueSet = new Set(siblings.map(sibling => sibling[valueProperty] === undefined ? false : sibling[valueProperty])); // true, false, null, undefined

      if (valueSet.size > 1 || (valueSet.size === 1 && valueSet.has(null as T[keyof T]))) {
        parentNode[valueProperty] = null as NonNullable<T>[keyof T]; // Mixed state

        // Recursively update the parent of the current parent node
        updateParentBasedOnSiblings(parentNode);
      } else if (valueSet.size === 1 && !valueSet.has(undefined as T[keyof T])) {
        parentNode[valueProperty] = siblings[0][valueProperty] as NonNullable<T>[keyof T]; // Assign the value of the first child

        // Recursively update the parent of the current parent node
        updateParentBasedOnSiblings(parentNode);
      }
    }

    if (startingNode) {
      updateNodeAndChildren(startingNode, newValue);
      updateParentBasedOnSiblings(startingNode);
    }
  }
}