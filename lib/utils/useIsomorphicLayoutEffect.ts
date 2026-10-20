import { useEffect, useLayoutEffect } from 'react';

// useLayoutEffect warns during server rendering, where effects never run anyway
export const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;
