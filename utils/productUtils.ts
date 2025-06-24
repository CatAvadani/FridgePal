import { Product, ProductDisplay } from '@/types/interfaces';

export const calculateDaysUntilExpiry = (expirationDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expirationDate);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const convertToProductDisplay = (product: Product): ProductDisplay => {
  const daysUntilExpiry = calculateDaysUntilExpiry(product.expirationDate);
  const imageUrl = getImageUrlForProduct(
    product.productName,
    product.categoryId
  );

  return {
    ...product,
    daysUntilExpiry,
    imageUrl,
  };
};

// Helper function to get image URL based on product name or category
export const getImageUrlForProduct = (
  productName: string | undefined,
  categoryId: number
): string => {
  // Default images based on category
  const categoryImages: Record<number, string> = {
    1: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=900&auto=format&fit=crop&q=60', // Dairy
    2: 'https://images.unsplash.com/photo-1641898378548-ac93da99786a?w=900&auto=format&fit=crop&q=60', // Meat
    3: 'https://images.unsplash.com/photo-1518164147695-36c13dd568f5?w=900&auto=format&fit=crop&q=60', // Vegetables
    4: 'https://images.unsplash.com/photo-1584306670957-acf935f5033c?w=900&auto=format&fit=crop&q=60', // Fruits
    5: 'https://images.unsplash.com/photo-1499125562588-29fb8a56b5d5?w=900&auto=format&fit=crop&q=60', // Fish
    6: 'https://images.unsplash.com/photo-1587015990127-424b954e38b5?w=900&auto=format&fit=crop&q=60', // Beverages
    7: 'https://images.unsplash.com/photo-1590685006710-2b478c69b26b?w=900&auto=format&fit=crop&q=60', // Frozen
    8: 'https://plus.unsplash.com/premium_photo-1675788939191-713c2abf3da6?w=900&auto=format&fit=crop&q=60', // Other
  };

  if (!productName) {
    return categoryImages[categoryId] || categoryImages[8];
  }

  // Map of keywords to image URLs
  const imageMap: Record<string, string> = {
    milk: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fG1pbGt8ZW58MHx8MHx8fDA%3D',
    chicken:
      'https://images.unsplash.com/photo-1641898378548-ac93da99786a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNoaWNrZW4lMjBicmVhc3R8ZW58MHx8MHx8fDA%3D',
    broccoli:
      'https://images.unsplash.com/photo-1518164147695-36c13dd568f5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YnJvY2NvbGl8ZW58MHx8MHx8fDA%3D',
    apple:
      'https://images.unsplash.com/photo-1584306670957-acf935f5033c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGFwcGxlfGVufDB8fDB8fHww',
    salmon:
      'https://images.unsplash.com/photo-1499125562588-29fb8a56b5d5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FsbW9ufGVufDB8fDB8fHww',
    'orange juice':
      'https://images.unsplash.com/photo-1587015990127-424b954e38b5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fG9yYW5nZSUyMGp1aWNlfGVufDB8fDB8fHww',
    peas: 'https://images.unsplash.com/photo-1590685006710-2b478c69b26b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cGVhc3xlbnwwfHwwfHx8MA%3D%3D',
    bread:
      'https://plus.unsplash.com/premium_photo-1675788939191-713c2abf3da6?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YnJlYWR8ZW58MHx8MHx8fDA%3D',
    yogurt:
      'https://images.unsplash.com/photo-1564149503905-7fef56abc1f2?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8eW9ndXJ0fGVufDB8fDB8fHww',
    beef: 'https://images.unsplash.com/photo-1613454320437-0c228c8b1723?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YmVlZiUyMG1lYXR8ZW58MHx8MHx8fDA%3D',
    banana:
      'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=900&auto=format&fit=crop&q=60',
  };

  const lowerProductName = productName.toLowerCase();
  for (const [key, url] of Object.entries(imageMap)) {
    if (lowerProductName.includes(key)) {
      return url;
    }
  }

  return categoryImages[categoryId] || categoryImages[8];
};
