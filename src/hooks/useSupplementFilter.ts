import { useMemo } from 'react';

/**
 * Filters an array of supplements by a search string.
 * Returns the original array when the query is empty.
 */
export default function useSupplementFilter<T extends Record<string, any>>(list: T[], query: string): T[] {
  return useMemo(() => {
    if (!query) return list;
    const lower = query.toLowerCase();
    return list.filter(item => JSON.stringify(item).toLowerCase().includes(lower));
  }, [list, query]);
}