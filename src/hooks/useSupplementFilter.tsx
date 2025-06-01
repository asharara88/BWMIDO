import { useMemo } from 'react';
import type { Supplement } from '../types/supplements';

/**
 * Provides a memoized filter for supplement arrays.
 * @param supplements - Array of supplements to filter
 * @param query - Search string to match against name and description
 * @returns Filtered list of supplements
 */
export function useSupplementFilter(supplements: Supplement[], query: string) {
  const normalized = query.toLowerCase();

  return useMemo(() => {
    if (!normalized) return supplements;
    return supplements.filter(
      (s) =>
        s.name.toLowerCase().includes(normalized) ||
        s.description.toLowerCase().includes(normalized)
    );
  }, [supplements, normalized]);
}
