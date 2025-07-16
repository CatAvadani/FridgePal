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

  return {
    ...product,
    daysUntilExpiry,
    imageUrl:
      product.imageUrl ||
      getImageUrlForProduct(product.productName, product.categoryId),
  };
};

export const mapSupabaseProductToProduct = (item: any): Product => ({
  itemId: item.id,
  productName: item.product_name,
  quantity: item.quantity,
  creationDate: item.created_at,
  expirationDate: item.expiration_date,
  notified: false,
  categoryId: item.category_id,
  categoryName: item.categories?.name || 'Unknown',
  imageUrl: item.image_url || undefined,
});

// Fallback images when no custom image is provided
export const getImageUrlForProduct = (
  productName: string | undefined,
  categoryId: number
): string => {
  const categoryImages: Record<number, string> = {
    1: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=900&auto=format&fit=crop&q=60',
    2: 'https://images.unsplash.com/photo-1641898378548-ac93da99786a?w=900&auto=format&fit=crop&q=60',
    3: 'https://images.unsplash.com/photo-1518164147695-36c13dd568f5?w=900&auto=format&fit=crop&q=60',
    4: 'https://images.unsplash.com/photo-1584306670957-acf935f5033c?w=900&auto=format&fit=crop&q=60',
    5: 'https://images.unsplash.com/photo-1499125562588-29fb8a56b5d5?w=900&auto=format&fit=crop&q=60',
    6: 'https://images.unsplash.com/photo-1587015990127-424b954e38b5?w=900&auto=format&fit=crop&q=60',
    7: 'https://images.unsplash.com/photo-1590685006710-2b478c69b26b?w=900&auto=format&fit=crop&q=60',
    8: 'https://plus.unsplash.com/premium_photo-1675788939191-713c2abf3da6?w=900&auto=format&fit=crop&q=60',
  };

  return categoryImages[categoryId] || categoryImages[8];
};
