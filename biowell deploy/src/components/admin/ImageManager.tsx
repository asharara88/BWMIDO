import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { allImageAssets, validateAllImages, ImageAsset } from '../../utils/imageManager';
import ImageWithFallback from '../common/ImageWithFallback';
import { AlertTriangle, CheckCircle, Search, X, Filter, Download, RefreshCw } from 'lucide-react';

const ImageManager = () => {
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [validationResults, setValidationResults] = useState<{
    valid: ImageAsset[];
    invalid: ImageAsset[];
  } | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    
    try {
      setImages(allImageAssets);
      setFilteredImages(allImageAssets);
      
      // Validate images
      await validateImages();
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateImages = async () => {
    setValidating(true);
    try {
      const results = await validateAllImages();
      setValidationResults(results);
    } catch (error) {
      console.error('Error validating images:', error);
    } finally {
      setValidating(false);
    }
  };

  useEffect(() => {
    let filtered = images;
    
    // Filter by category if selected
    if (selectedCategory) {
      filtered = filtered.filter(img => img.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(img => 
        img.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.url.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredImages(filtered);
  }, [searchQuery, selectedCategory, images]);

  // Get unique categories
  const categories = Array.from(new Set(images.map(img => img.category)));

  // Generate report data
  const generateReport = () => {
    if (!validationResults) return;
    
    const reportData = {
      timestamp: new Date().toISOString(),
      totalImages: images.length,
      validImages: validationResults.valid.length,
      invalidImages: validationResults.invalid.length,
      categoryCounts: categories.map(category => ({
        category,
        count: images.filter(img => img.category === category).length,
        validCount: validationResults.valid.filter(img => img.category === category).length,
        invalidCount: validationResults.invalid.filter(img => img.category === category).length,
      })),
      invalidImagesList: validationResults.invalid.map(img => ({
        id: img.id,
        url: img.url,
        category: img.category,
        fallbackAvailable: !!img.fallbackUrl
      }))
    };
    
    // Create and download JSON file
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `image-validation-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold">Image Asset Manager</h2>
        
        <div className="flex items-center gap-2">
          <button
            onClick={validateImages}
            disabled={validating}
            className="flex items-center gap-2 rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] px-4 py-2 text-sm font-medium text-text-light transition-colors hover:bg-[hsl(var(--color-card-hover))] hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
          >
            {validating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Validate Images
              </>
            )}
          </button>
          
          <button
            onClick={generateReport}
            disabled={!validationResults}
            className="flex items-center gap-2 rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] px-4 py-2 text-sm font-medium text-text-light transition-colors hover:bg-[hsl(var(--color-card-hover))] hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Validation Summary */}
      {validationResults && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-4">
            <div className="mb-2 text-sm text-text-light">Total Images</div>
            <div className="text-2xl font-bold">{images.length}</div>
          </div>
          
          <div className="rounded-lg border border-success/20 bg-success/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-success">
              <CheckCircle className="h-4 w-4" />
              Valid Images
            </div>
            <div className="text-2xl font-bold text-success">{validationResults.valid.length}</div>
          </div>
          
          <div className="rounded-lg border border-warning/20 bg-warning/5 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-warning">
              <AlertTriangle className="h-4 w-4" />
              Invalid Images
            </div>
            <div className="text-2xl font-bold text-warning">{validationResults.invalid.length}</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
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
        
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-text-light" />
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
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
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
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
      </div>

      {/* Image grid */}
      {filteredImages.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredImages.map((image, index) => {
            const isValid = !validationResults || validationResults.valid.some(img => img.id === image.id);
            
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
                } p-4 transition-shadow hover:shadow-md`}
              >
                <div className="aspect-square overflow-hidden rounded-md">
                  <ImageWithFallback
                    src={image.url}
                    alt={image.alt}
                    className="h-full w-full object-contain transition-transform group-hover:scale-105"
                    fallbackSrc={image.fallbackUrl}
                  />
                </div>
                <div className="mt-2">
                  <div className="truncate font-medium text-sm">{image.id}</div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[hsl(var(--color-surface-1))] px-2 py-0.5 text-xs text-text-light">
                      {image.category}
                    </span>
                    {isValid === false && (
                      <span className="text-xs text-warning flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Invalid
                      </span>
                    )}
                  </div>
                </div>
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

export default ImageManager;