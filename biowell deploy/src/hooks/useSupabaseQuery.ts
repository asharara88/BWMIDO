import { useEffect, useState } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import type { PostgrestError } from '@supabase/supabase-js';

interface QueryOptions<T> {
  table: string;
  select?: string;
  match?: Record<string, any>;
  order?: { column: string; ascending?: boolean };
  limit?: number;
  onSuccess?: (data: T[]) => void;
  onError?: (error: PostgrestError) => void;
}

export function useSupabaseQuery<T = any>(options: QueryOptions<T>) {
  const { supabase } = useSupabase();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let query = supabase.from(options.table).select(options.select || '*');

        if (options.match) {
          Object.entries(options.match).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }

        if (options.order) {
          query = query.order(options.order.column, {
            ascending: options.order.ascending ?? true,
          });
        }

        if (options.limit) {
          query = query.limit(options.limit);
        }

        const { data: result, error } = await query;

        if (error) {
          throw error;
        }

        setData(result || []);
        options.onSuccess?.(result || []);
      } catch (err) {
        const postgrestError = err as PostgrestError;
        setError(postgrestError);
        options.onError?.(postgrestError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, options.table, options.select, options.match, options.order, options.limit]);

  return { data, loading, error };
}