import React, { useEffect, useState } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ComponentItem {
  name: string;
  dosage: string;
  price: number;
}

interface Stack {
  id: string;
  category: string;
  name: string;
  total_price: number;
  components: ComponentItem[];
}

export default function SupplementCatalog() {
  const { supabase } = useSupabase();
  const [stacks, setStacks] = useState<Stack[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStacks() {
      setLoading(true);
      const { data, error } = await supabase
        .from<Stack>('supplement_stacks')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });
      if (error) console.error(error.message);
      else setStacks(data || []);
      setLoading(false);
    }
    fetchStacks();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!stacks.length) {
    return (
      <div className="rounded-lg bg-[hsl(var(--color-card))] p-6 text-center text-text-light">
        No supplement stacks available.
      </div>
    );
  }

  // Group by category
  const grouped = stacks.reduce<Record<string, Stack[]>>((acc, stack) => {
    if (!acc[stack.category]) acc[stack.category] = [];
    acc[stack.category].push(stack);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([category, items]) => (
        <section key={category}>
          <h2 className="mb-4 text-xl font-bold text-text">{category}</h2>
          <div className="space-y-4">
            {items.map(stack => (
              <div key={stack.id}>
                <button
                  onClick={() => setOpenId(openId === stack.id ? null : stack.id)}
                  className="flex w-full items-center justify-between rounded-lg bg-[hsl(var(--color-card))] px-6 py-4 text-left transition-colors hover:bg-[hsl(var(--color-card-hover))]"
                >
                  <div>
                    <h3 className="text-lg font-medium text-text">{stack.name}</h3>
                    <p className="text-text-light">AED {stack.total_price.toFixed(2)}</p>
                  </div>
                  {openId === stack.id ? (
                    <ChevronUp className="h-5 w-5 text-text-light" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-text-light" />
                  )}
                </button>

                {openId === stack.id && (
                  <div className="mt-4 overflow-hidden rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))]">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[hsl(var(--color-border))]">
                          <th className="p-4 text-left font-medium text-text-light">Product</th>
                          <th className="p-4 text-left font-medium text-text-light">Dosage</th>
                          <th className="p-4 text-right font-medium text-text-light">Price (AED)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[hsl(var(--color-border))]">
                        {stack.components.map((component, index) => (
                          <tr key={index}>
                            <td className="p-4 text-text">{component.name}</td>
                            <td className="p-4 text-text-light">{component.dosage}</td>
                            <td className="p-4 text-right text-text">{component.price.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}