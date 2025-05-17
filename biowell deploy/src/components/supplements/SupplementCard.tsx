import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, ExternalLink, AlertCircle, Info, ChevronDown, ChevronUp, ShoppingCart, Heart, Star } from 'lucide-react';
import { Supplement } from '../../types/supplements';
import ImageWithFallback from '../common/ImageWithFallback';

interface SupplementCardProps {
  supplement: Supplement;
  onAddToStack?: () => void;
  onRemoveFromStack?: () => void;
  onAddToCart?: () => void;
  onViewDetails?: () => void;
  isInStack?: boolean;
}

const SupplementCard = ({ 
  supplement, 
  onAddToStack,
  onRemoveFromStack,
  onAddToCart,
  onViewDetails,
  isInStack = false 
}: SupplementCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Safely access properties with fallbacks
  const categories = supplement?.categories || [];
  const useCases = supplement?.use_cases || [];
  const evidenceLevel = supplement?.evidence_level || 'Yellow';
  
  // Get the form image URL with fallback
  const formImageUrl = supplement?.form_image_url || supplement?.image_url || 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

  // Generate random rating for demo purposes
  const rating = (Math.floor(Math.random() * 10) + 35) / 10; // Random rating between 3.5 and 4.5

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full flex-col rounded-xl shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Card Header with Image - No border, full width, fixed height */}
      <div 
        className="relative h-40 w-full overflow-hidden rounded-t-xl cursor-pointer"
        onClick={onViewDetails}
      >
        <ImageWithFallback 
          src={formImageUrl}
          alt={supplement?.name || 'Supplement'}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          fallbackSrc="https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        />
        <div className="absolute top-2 right-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            evidenceLevel === 'Green' ? 'bg-success/20 text-success dark:bg-success/30 dark:text-success-light' :
            evidenceLevel === 'Yellow' ? 'bg-warning/20 text-warning dark:bg-warning/30 dark:text-warning-light' :
            'bg-error/20 text-error dark:bg-error/30 dark:text-error-light'
          }`}>
            {evidenceLevel}
          </span>
        </div>
        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
          <Star className="h-3 w-3 fill-warning text-warning" />
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Card Content - Separate from image */}
      <div className="flex flex-1 flex-col border border-t-0 border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-4 rounded-b-xl">
        <div className="mb-2">
          <h3 className="text-base font-semibold cursor-pointer hover:text-primary" onClick={onViewDetails}>{supplement?.name || 'Unnamed Supplement'}</h3>
        </div>

        {/* Price and Action */}
        <div className="mt-auto flex items-center justify-between">
          <div className="text-base font-bold">AED {supplement?.price_aed || 0}</div>
          <div className="flex gap-2">
            <button
              onClick={isInStack ? onRemoveFromStack : onAddToStack}
              className={`flex items-center justify-center rounded-lg p-2 transition-colors ${
                isInStack
                  ? 'bg-error/20 text-error hover:bg-error/30 dark:bg-error/30 dark:text-error-light dark:hover:bg-error/40'
                  : 'bg-[hsl(var(--color-surface-1))] text-text-light hover:bg-[hsl(var(--color-card-hover))] hover:text-text'
              }`}
              title={isInStack ? "Remove from Stack" : "Add to Stack"}
            >
              <Heart className={`h-5 w-5 ${isInStack ? 'fill-error' : ''}`} />
            </button>
            
            <button
              onClick={onAddToCart}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>

        {/* Expand/Collapse Toggle */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-[hsl(var(--color-border))] px-3 py-2 text-xs text-text-light transition-colors hover:bg-[hsl(var(--color-card-hover))] hover:text-text"
        >
          {showDetails ? (
            <>
              Show Less <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              View Details <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Expanded Details */}
      {showDetails && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-1))] p-4 rounded-b-xl mt-[-1rem]"
        >
          {/* Description */}
          <div className="mb-3">
            <p className="text-xs text-text-light">{supplement?.description || 'No description available'}</p>
          </div>
          
          {/* Categories */}
          <div className="mb-3">
            <div className="mb-1.5 text-xs font-medium">Categories</div>
            <div className="flex flex-wrap gap-1.5">
              {categories && categories.length > 0 ? (
                categories.map((category, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary dark:bg-primary/30 dark:text-primary-light"
                  >
                    {category}
                  </span>
                ))
              ) : (
                <span className="rounded-full bg-[hsl(var(--color-surface-2))] px-2 py-0.5 text-xs text-text-light">
                  General
                </span>
              )}
            </div>
          </div>
          
          {/* Use Cases */}
          <div className="mb-3">
            <div className="mb-1.5 text-xs font-medium">Use Cases</div>
            <div className="flex flex-wrap gap-1.5">
              {useCases && useCases.length > 0 ? (
                useCases.map((useCase, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-[hsl(var(--color-surface-2))] px-2 py-0.5 text-xs text-text dark:text-text-light"
                  >
                    {useCase}
                  </span>
                ))
              ) : (
                <span className="text-xs text-text-light">No specific use cases listed</span>
              )}
            </div>
          </div>

          {/* Dosage */}
          <div className="mb-3 text-xs">
            <span className="font-medium">Dosage:</span> {supplement?.dosage || 'As directed'}
          </div>

          {/* Evidence Level Info */}
          <div className="rounded-lg bg-[hsl(var(--color-surface-2))] p-3 dark:bg-[hsl(var(--color-card))]">
            <div className="mb-1 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">Evidence Level: {evidenceLevel}</span>
            </div>
            <p className="text-xs text-text-light">
              {evidenceLevel === 'Green' 
                ? 'Strong scientific evidence supports the use of this supplement.'
                : evidenceLevel === 'Yellow'
                ? 'Moderate evidence exists, more research may be needed.'
                : 'Limited evidence available, use with caution.'}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SupplementCard;