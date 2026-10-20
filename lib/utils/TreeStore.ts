export const NODE_EXPANDED = 1;
export const NODE_ACTIVE = 2;

// Holds per-node view state (expansion, roving focus) outside React state so each node can
// subscribe to its own slice and re-render only when that slice changes.
export class TreeStore<K> {
  private listeners = new Set<() => void>();
  private expandedOverrides = new Map<K, boolean>();
  private elements = new Map<K, HTMLElement>();
  private elementIDs = new Map<HTMLElement, K>();
  private activeID: K | undefined;
  private defaultExpanded: boolean;

  // Supplied by TreeSelect so collapsing a node can move focus out of the hidden subtree
  private parentResolver: (id: K) => K | undefined = () => undefined;

  setParentResolver(resolver: (id: K) => K | undefined) {
    this.parentResolver = resolver;
  }

  getParentID(id: K): K | undefined {
    return this.parentResolver(id);
  }

  constructor(defaultExpanded: boolean, activeID?: K) {
    this.defaultExpanded = defaultExpanded;
    this.activeID = activeID;
  }

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private emit() {
    this.listeners.forEach(listener => listener());
  }

  getNodeState(id: K): number {
    return (this.isExpanded(id) ? NODE_EXPANDED : 0) | (this.activeID === id ? NODE_ACTIVE : 0);
  }

  isExpanded(id: K): boolean {
    return this.expandedOverrides.get(id) ?? this.defaultExpanded;
  }

  // Changing the default expands or collapses every node, including ones the user toggled
  setDefaultExpanded(defaultExpanded: boolean) {
    if (defaultExpanded === this.defaultExpanded)
      return;

    this.defaultExpanded = defaultExpanded;
    this.expandedOverrides.clear();
    this.emit();
  }

  setExpanded(id: K, expanded: boolean) {
    if (this.isExpanded(id) === expanded)
      return;

    this.expandedOverrides.set(id, expanded);

    // Collapsing hides the active descendant, so the collapsed node becomes the tab stop
    if (!expanded && this.activeID !== undefined && this.isAncestor(id, this.activeID)) {
      const hadFocus = typeof document !== 'undefined' && this.elements.get(this.activeID)?.contains(document.activeElement);
      this.activeID = id;
      if (hadFocus)
        this.elements.get(id)?.focus();
    }

    this.emit();
  }

  getActiveID(): K | undefined {
    return this.activeID;
  }

  setActive(id: K | undefined) {
    if (id === this.activeID)
      return;

    this.activeID = id;
    this.emit();
  }

  focus(id: K) {
    this.setActive(id);
    this.elements.get(id)?.focus();
  }

  isAncestor(ancestorID: K, id: K): boolean {
    let parentID = this.getParentID(id);
    while (parentID !== undefined) {
      if (parentID === ancestorID)
        return true;
      parentID = this.getParentID(parentID);
    }
    return false;
  }

  registerElement(id: K, element: HTMLElement | null) {
    const previous = this.elements.get(id);
    if (previous)
      this.elementIDs.delete(previous);

    if (element) {
      this.elements.set(id, element);
      this.elementIDs.set(element, id);
    } else {
      this.elements.delete(id);
    }
  }

  getIDForElement(element: EventTarget | null): K | undefined {
    return element instanceof HTMLElement ? this.elementIDs.get(element) : undefined;
  }
}
