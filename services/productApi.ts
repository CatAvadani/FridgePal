import {
  CreateProductRequest,
  Product,
  ProductDisplay,
} from '@/types/interfaces';
import { convertToProductDisplay } from '@/utils/productUtils';
import { apiCall, ENDPOINTS } from './apiClient';

export const getProducts = async (): Promise<ProductDisplay[]> => {
  try {
    console.log('Fetching products from API...');
    const products: Product[] = await apiCall(ENDPOINTS.GET_ALL);
    console.log('Products fetched:', products);

    return products.map(convertToProductDisplay);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const createProduct = async (
  productData: CreateProductRequest
): Promise<ProductDisplay> => {
  try {
    const product: Product = await apiCall(ENDPOINTS.CREATE, {
      method: 'POST',
      body: JSON.stringify(productData),
    });

    return convertToProductDisplay(product);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (
  itemId: string,
  updatedData: Partial<CreateProductRequest>
): Promise<ProductDisplay> => {
  try {
    const product: Product = await apiCall(`${ENDPOINTS.UPDATE}/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(updatedData),
    });

    return convertToProductDisplay(product);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (itemId: string): Promise<void> => {
  try {
    await apiCall(`${ENDPOINTS.DELETE}/${itemId}`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};
