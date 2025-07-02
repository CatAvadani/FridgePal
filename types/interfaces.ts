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
  itemId: string;
  productName: string;
  quantity: number;
  creationDate: string;
  expirationDate: string;
  notified: boolean;
  categoryId: number;
  categoryName?: string;
  imageUrl?: string;
}

export interface ProductDisplay extends Product {
  daysUntilExpiry: number;
}

export interface CreateProductRequest {
  productName: string;
  quantity: number;
  expirationDate: string;
  categoryId: number;
}

export interface BackendAIResponse {
  itemName: string;
  categoryId: number;
  categoryName: string;
  quantity: number;
  shelfLifeDays: number;
}

export interface AIAnalysisResult {
  productName: string;
  expirationDate: string;
  quantity: number;
  categoryId: number;
  categoryName: string;
  confidence: number;
}

export const CATEGORIES: Category[] = [
  { categoryId: 1, categoryName: 'Dairy' },
  { categoryId: 2, categoryName: 'Meat' },
  { categoryId: 3, categoryName: 'Vegetables' },
  { categoryId: 4, categoryName: 'Fruits' },
  { categoryId: 5, categoryName: 'Fish' },
  { categoryId: 6, categoryName: 'Beverages' },
  { categoryId: 7, categoryName: 'Frozen' },
  { categoryId: 8, categoryName: 'Other' },
];

export const getCategoryName = (categoryId: number): string => {
  return (
    CATEGORIES.find((cat) => cat.categoryId === categoryId)?.categoryName ||
    'Other'
  );
};
