import { useMemo } from 'react';

/**
 * Generic filter hook for supplement lists.
 * Returns items matching the provided query across given fields.
 */

export default function useSupplementFilter<T extends Record<string, any>>(
  items: T[],
  query: string,
  fields: (keyof T)[]
) {
  const normalized = query.trim().toLowerCase();

  return useMemo(() => {
    if (!normalized) return items;
    return items.filter(item =>
      fields.some(field => {
        const value = item[field];
        return (
          typeof value === 'string' &&
          value.toLowerCase().includes(normalized)
        );
      })
    );
  }, [items, normalized, fields]);
}
