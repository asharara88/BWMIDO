import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface SupplementFiltersProps {
  categories: string[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedEvidenceLevel: string | null;
  setSelectedEvidenceLevel: (level: string | null) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  benefits: string[];
  selectedBenefits: string[];
  setSelectedBenefits: (benefits: string[]) => void;
}

const SupplementFilters = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedEvidenceLevel,
  setSelectedEvidenceLevel,
  priceRange,
  setPriceRange,
  benefits,
  selectedBenefits,
  setSelectedBenefits
}: SupplementFiltersProps) => {
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(priceRange);

  const handlePriceChange = (min: number, max: number) => {
    setLocalPriceRange([min, max]);
  };

  const applyPriceFilter = () => {
    setPriceRange(localPriceRange);
  };

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedEvidenceLevel(null);
    setPriceRange([0, 200]);
    setLocalPriceRange([0, 200]);
    setSelectedBenefits([]);
  };

  const toggleBenefit = (benefit: string) => {
    if (selectedBenefits.includes(benefit)) {
      setSelectedBenefits(selectedBenefits.filter(b => b !== benefit));
    } else {
      setSelectedBenefits([...selectedBenefits, benefit]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filters</h3>
        <button
          onClick={resetFilters}
          className="text-sm text-primary hover:text-primary-dark"
        >
          Reset All
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Categories */}
        <div>
          <h4 className="mb-3 text-sm font-medium">Categories</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                !selectedCategory
                  ? 'bg-primary text-white'
                  : 'bg-[hsl(var(--color-card-hover))] text-text-light hover:text-text'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-[hsl(var(--color-card-hover))] text-text-light hover:text-text'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Evidence Level */}
        <div>
          <h4 className="mb-3 text-sm font-medium">Evidence Level</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedEvidenceLevel(null)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                !selectedEvidenceLevel
                  ? 'bg-primary text-white'
                  : 'bg-[hsl(var(--color-card-hover))] text-text-light hover:text-text'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedEvidenceLevel('Green')}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedEvidenceLevel === 'Green'
                  ? 'bg-success text-white'
                  : 'bg-success/10 text-success hover:bg-success/20'
              }`}
            >
              Green
            </button>
            <button
              onClick={() => setSelectedEvidenceLevel('Yellow')}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedEvidenceLevel === 'Yellow'
                  ? 'bg-warning text-white'
                  : 'bg-warning/10 text-warning hover:bg-warning/20'
              }`}
            >
              Yellow
            </button>
            <button
              onClick={() => setSelectedEvidenceLevel('Red')}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedEvidenceLevel === 'Red'
                  ? 'bg-error text-white'
                  : 'bg-error/10 text-error hover:bg-error/20'
              }`}
            >
              Red
            </button>
          </div>
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-sm font-medium">Price Range (AED)</h4>
          <div className="text-sm">
            <span className="font-medium">{localPriceRange[0]}</span> - <span className="font-medium">{localPriceRange[1]}</span>
          </div>
        </div>
        <div className="mb-4 flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="200"
            value={localPriceRange[0]}
            onChange={(e) => handlePriceChange(parseInt(e.target.value), localPriceRange[1])}
            className="w-full"
          />
          <input
            type="range"
            min="0"
            max="200"
            value={localPriceRange[1]}
            onChange={(e) => handlePriceChange(localPriceRange[0], parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <button
          onClick={applyPriceFilter}
          className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Apply Price Filter
        </button>
      </div>

      {/* Benefits */}
      <div>
        <h4 className="mb-3 text-sm font-medium">Health Benefits</h4>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {benefits.slice(0, 12).map((benefit) => (
            <button
              key={benefit}
              onClick={() => toggleBenefit(benefit)}
              className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs transition-colors ${
                selectedBenefits.includes(benefit)
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-[hsl(var(--color-border))] text-text-light hover:border-primary/30'
              }`}
            >
              <span className="truncate">{benefit}</span>
              {selectedBenefits.includes(benefit) && (
                <Check className="h-3.5 w-3.5 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
        {benefits.length > 12 && (
          <button className="mt-2 text-xs text-primary hover:text-primary-dark">
            Show more benefits...
          </button>
        )}
      </div>
    </div>
  );
};

export default SupplementFilters;