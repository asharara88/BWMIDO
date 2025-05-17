import { useState, useEffect } from 'react';
import { ImageAsset, checkImageUrl } from '../utils/imageManager';

interface UseImageValidationProps {
  images: ImageAsset[];
  validateOnMount?: boolean;
}

interface ValidationResult {
  valid: ImageAsset[];
  invalid: ImageAsset[];
  loading: boolean;
  validateImages: () => Promise<void>;
}

export function useImageValidation({ 
  images, 
  validateOnMount = false 
}: UseImageValidationProps): ValidationResult {
  const [valid, setValid] = useState<ImageAsset[]>([]);
  const [invalid, setInvalid] = useState<ImageAsset[]>([]);
  const [loading, setLoading] = useState(false);

  const validateImages = async () => {
    setLoading(true);
    
    try {
      const results = await Promise.all(
        images.map(async (image) => {
          const isValid = await checkImageUrl(image.url);
          return { image, isValid };
        })
      );
      
      setValid(results.filter(r => r.isValid).map(r => r.image));
      setInvalid(results.filter(r => !r.isValid).map(r => r.image));
    } catch (error) {
      console.error('Error validating images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (validateOnMount) {
      validateImages();
    }
  }, [validateOnMount, images]);

  return {
    valid,
    invalid,
    loading,
    validateImages
  };
}