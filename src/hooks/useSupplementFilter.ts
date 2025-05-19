import { useMemo } from 'react';

export default function useSupplementFilter<T>(items: T[], query: string, key: keyof T): T[] {
  return useMemo(() => {
    if (!query) return items;
    const lower = query.toLowerCase();
    return items.filter((item) => String(item[key]).toLowerCase().includes(lower));
  }, [items, query, key]);
}
