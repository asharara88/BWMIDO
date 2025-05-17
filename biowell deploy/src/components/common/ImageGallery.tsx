import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { allImageAssets, validateAllImages, ImageAsset } from '../../utils/imageManager';
import ImageWithFallback from './ImageWithFallback';
import { AlertTriangle, CheckCircle, Search, X } from 'lucide-react';

interface ImageGalleryProps {
  category?: string;
  onSelect?: (image: ImageAsset) => void;
  className?: string;
}

const ImageGallery = ({ category, onSelect, className = '' }: ImageGalleryProps) => {
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [validationResults, setValidationResults] = useState<{
    valid: ImageAsset[];
    invalid: ImageAsset[];
  } | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      
      try {
        // Filter by category if provided
        const filtered = category 
          ? allImageAssets.filter(img => img.category === category)
          : allImageAssets;
        
        setImages(filtered);
        setFilteredImages(filtered);
        
        // Validate images
        const results = await validateAllImages();
        setValidationResults(results);
      } catch (error) {
        console.error('Error loading images:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadImages();
  }, [category]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = images.filter(img => 
        img.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredImages(filtered);
    } else {
      setFilteredImages(images);
    }
  }, [searchQuery, images]);

  const handleImageClick = (image: ImageAsset) => {
    if (onSelect) {
      onSelect(image);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and validation summary */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-light" />
          <input
            type="text"
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-1))] pl-10 pr-4 py-2 text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light hover:text-text"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        {validationResults && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-success flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              {validationResults.valid.length} valid
            </span>
            <span className="text-warning flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              {validationResults.invalid.length} invalid
            </span>
          </div>
        )}
      </div>

      {/* Image grid */}
      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredImages.map((image, index) => {
            const isValid = validationResults?.valid.some(img => img.id === image.id);
            
            return (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`group relative overflow-hidden rounded-lg border ${
                  isValid === false 
                    ? 'border-warning/50 bg-warning/5' 
                    : 'border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))]'
                } p-2 transition-shadow hover:shadow-md`}
                onClick={() => handleImageClick(image)}
              >
                <div className="aspect-square overflow-hidden rounded-md">
                  <ImageWithFallback
                    src={image.url}
                    alt={image.alt}
                    className="h-full w-full object-contain transition-transform group-hover:scale-105"
                    fallbackSrc={image.fallbackUrl}
                  />
                </div>
                <div className="mt-2 truncate text-xs text-text-light">
                  {image.id}
                </div>
                {isValid === false && (
                  <div className="absolute right-2 top-2 rounded-full bg-warning/20 p-1">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-8 text-center">
          <AlertTriangle className="mb-2 h-8 w-8 text-warning" />
          <p className="text-text-light">No images found matching your search criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;