import React from 'react';

// Supports both callback refs and ref objects
export function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null): void {
  if (typeof ref === 'function')
    ref(value);
  else if (ref)
    (ref as React.RefObject<T | null>).current = value;
}
