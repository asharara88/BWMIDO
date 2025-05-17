import { useState, useEffect } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { SupplementForm } from '../types/supplements';
import { getSupplementFormImage } from '../utils/supplementForms';

export function useSupplementForms() {
  const [forms, setForms] = useState<SupplementForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { supabase } = useSupabase();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('supplement_forms')
          .select('*');

        if (error) {
          throw error;
        }

        setForms(data || []);
      } catch (err) {
        console.error('Error fetching supplement forms:', err);
        setError(err as Error);
        
        // Fallback to hardcoded forms if there's an error
        setForms([
          {
            form_type: 'softgel',
            image_url: getSupplementFormImage('softgel'),
            used_for: 'Omega-3, Vitamin D3, CoQ10, Krill Oil'
          },
          {
            form_type: 'capsule_solid',
            image_url: getSupplementFormImage('capsule_solid'),
            used_for: 'Zinc, Magnesium, Vitamin B Complex'
          },
          {
            form_type: 'capsule_powder',
            image_url: getSupplementFormImage('capsule_powder'),
            used_for: 'Rhodiola, Ashwagandha, Tongkat Ali, Berberine'
          },
          {
            form_type: 'powder_large',
            image_url: getSupplementFormImage('powder_large'),
            used_for: 'Whey Protein, Casein, Meal Replacement'
          },
          {
            form_type: 'powder_fine',
            image_url: getSupplementFormImage('powder_fine'),
            used_for: 'Creatine, Beta-Alanine, L-Glutamine'
          },
          {
            form_type: 'liquid_bottle',
            image_url: getSupplementFormImage('liquid_bottle'),
            used_for: 'CBD, Vitamin D3 Drops, Melatonin Drops'
          },
          {
            form_type: 'gummy',
            image_url: getSupplementFormImage('gummy'),
            used_for: 'Multivitamin Gummies, Biotin, Melatonin, Kids Vitamins'
          },
          {
            form_type: 'stick_pack',
            image_url: getSupplementFormImage('stick_pack'),
            used_for: 'Electrolytes, Greens Powder, Collagen Peptides, Pre-Workout'
          },
          {
            form_type: 'effervescent',
            image_url: getSupplementFormImage('effervescent'),
            used_for: 'Vitamin C, Magnesium Efferv., Hydration Tablets'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [supabase]);

  return { forms, loading, error };
}