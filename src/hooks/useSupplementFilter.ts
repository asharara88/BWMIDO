import { useMemo } from 'react';

codex/fix-onboarding-index-and-protectedroute-import-path
export default function useSupplementFilter<T>(items: T[], query: string, key: keyof T): T[] {
  return useMemo(() => {
    if (!query) return items;
    const lower = query.toLowerCase();
    return items.filter((item) => String(item[key]).toLowerCase().includes(lower));
  }, [items, query, key]);
}
=======
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
main
