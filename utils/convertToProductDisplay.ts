import { Product, ProductDisplay, getCategoryName } from '@/types/interfaces';

export const convertToProductDisplay = (product: Product): ProductDisplay => {
  const daysUntilExpiry = calculateDaysUntilExpiry(product.expirationDate);
  const categoryName = getCategoryName(product.categoryId);
  return { ...product, daysUntilExpiry, categoryName };
};

export const calculateDaysUntilExpiry = (expirationDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expirationDate);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
