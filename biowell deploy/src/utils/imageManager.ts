// Types for image assets
export interface ImageAsset {
  id: string;
  url: string;
  alt: string;
  category: 'logo' | 'background' | 'device' | 'supplement';
  fallbackUrl?: string;
}

// Logo assets
export const logoAssets: ImageAsset[] = [
  {
    id: 'logo-light',
    url: 'https://jvqweleqjkrgldeflnfr.supabase.co/storage/v1/object/sign/heroes/logo%20light.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzFhYTRlZDEyLWU0N2QtNDcyNi05ZmI0LWQ3MWM5MGFlOTYyZSJ9.eyJ1cmwiOiJoZXJvZXMvbG9nbyBsaWdodC5qcGciLCJpYXQiOjE3NDYzNjkzNDQsImV4cCI6MTc3NzkwNTM0NH0.SGKPliqSU7hdSw0iPV1g0tCZACLSnJSksnOQQExUX6Q',
    alt: 'Biowell Logo Light',
    category: 'logo',
    fallbackUrl: 'https://images.pexels.com/photos/4226119/pexels-photo-4226119.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  },
  {
    id: 'logo-dark',
    url: 'https://jvqweleqjkrgldeflnfr.supabase.co/storage/v1/object/sign/heroes/logobg.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzFhYTRlZDEyLWU0N2QtNDcyNi05ZmI0LWQ3MWM5MGFlOTYyZSJ9.eyJ1cmwiOiJoZXJvZXMvbG9nb2JnLnBuZyIsImlhdCI6MTc0NjM2OTM3OCwiZXhwIjoxNzc3OTA1Mzc4fQ.HjQ9ywxiZjxelKbNd1o6Cowf7GTW94l5oIFgHYqYR18',
    alt: 'Biowell Logo Dark',
    category: 'logo',
    fallbackUrl: 'https://images.pexels.com/photos/4226119/pexels-photo-4226119.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

// Background images
export const backgroundAssets: ImageAsset[] = [
  {
    id: 'coach-background',
    url: 'https://jvqweleqjkrgldeflnfr.supabase.co/storage/v1/object/sign/heroes/COACH2.svg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzFhYTRlZDEyLWU0N2QtNDcyNi05ZmI0LWQ3MWM5MGFlOTYyZSJ9.eyJ1cmwiOiJoZXJvZXMvQ09BQ0gyLnN2ZyIsImlhdCI6MTc0NTkzMDM0MiwiZXhwIjoxNzc3NDY2MzQyfQ.wc6BUKNjTPqdV4RaDNj8T45TrIhwetUhsy1JOU4v6SQ',
    alt: 'Coach Background',
    category: 'background',
    fallbackUrl: 'https://images.pexels.com/photos/4226119/pexels-photo-4226119.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
  }
];

// Device images
export const deviceAssets: ImageAsset[] = [
  {
    id: 'freestyle-libre',
    url: 'https://images.pexels.com/photos/4226119/pexels-photo-4226119.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'Freestyle Libre CGM',
    category: 'device'
  },
  {
    id: 'apple-watch',
    url: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'Apple Watch',
    category: 'device'
  }
];

// Supplement images
export const supplementAssets: ImageAsset[] = [
  {
    id: 'softgel',
    url: 'https://images.pexels.com/photos/139655/pexels-photo-139655.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'Softgel Supplement',
    category: 'supplement'
  },
  {
    id: 'capsule',
    url: 'https://images.pexels.com/photos/143654/pexels-photo-143654.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    alt: 'Capsule Supplement',
    category: 'supplement'
  }
];

// Combine all assets
export const allImageAssets: ImageAsset[] = [
  ...logoAssets,
  ...backgroundAssets,
  ...deviceAssets,
  ...supplementAssets
];

// Function to check if an image URL is valid
export const checkImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error(`Error checking image URL ${url}:`, error);
    return false;
  }
};

// Function to validate all images
export const validateAllImages = async (): Promise<{ valid: ImageAsset[], invalid: ImageAsset[] }> => {
  const results = await Promise.all(
    allImageAssets.map(async (image) => {
      const isValid = await checkImageUrl(image.url);
      return { image, isValid };
    })
  );
  
  return {
    valid: results.filter(r => r.isValid).map(r => r.image),
    invalid: results.filter(r => !r.isValid).map(r => r.image)
  };
};

// Function to preload critical images
export const preloadCriticalImages = (): void => {
  const criticalImages = [
    ...logoAssets,
    ...backgroundAssets
  ];
  
  criticalImages.forEach(asset => {
    const img = new Image();
    img.src = asset.url;
  });
};