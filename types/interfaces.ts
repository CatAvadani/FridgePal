export interface User {
  userId: string;
  email: string;
  password: string;
  phoneNumber?: string;
  creationDate: string;
}

export interface Category {
  categoryId: number;
  categoryName: string;
}

export interface Product {
  productId: string;
  userId: string;
  productName: string;
  quantity: number;
  creationDate: string;
  expirationDate: string;
  notified: boolean;
  categoryId: number;
  imageUrl?: string;
}

export interface ProductDisplay extends Product {
  daysUntilExpiry: number;
  categoryName?: string;
}

export const CATEGORIES: Category[] = [
  { categoryId: 1, categoryName: 'Dairy' },
  { categoryId: 2, categoryName: 'Meat' },
  { categoryId: 3, categoryName: 'Vegetables' },
  { categoryId: 4, categoryName: 'Fruits' },
];

export const getCategoryName = (categoryId: number): string => {
  return (
    CATEGORIES.find((cat) => cat.categoryId === categoryId)?.categoryName ||
    'Other'
  );
};
