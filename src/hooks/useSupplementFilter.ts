import { useMemo } from 'react';

interface Supplement {
  name: string;
  description?: string | null;
  [key: string]: any;
}

/**
 * Returns a memoized list of supplements filtered by search query.
 */
export default function useSupplementFilter<T extends Supplement>(
  supplements: T[],
  query: string
): T[] {
  return useMemo(() => {
    if (!query) return supplements;
    const q = query.toLowerCase();
    return supplements.filter((s) => {
      const nameMatch = s.name.toLowerCase().includes(q);
      const descMatch = s.description
        ? s.description.toLowerCase().includes(q)
        : false;
      return nameMatch || descMatch;
    });
  }, [supplements, query]);
}
