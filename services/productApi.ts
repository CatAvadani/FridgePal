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
  productData: CreateProductRequest,
  imageUri?: string | null
): Promise<ProductDisplay> => {
  try {
    console.log('Creating product:', productData);
    console.log('Image URI:', imageUri ? imageUri : 'No image');

    const formData = new FormData();
    formData.append('ProductName', productData.productName);
    formData.append('Quantity', productData.quantity.toString());
    formData.append('ExpirationDate', productData.expirationDate);
    formData.append('CategoryId', productData.categoryId.toString());

    if (imageUri) {
      console.log('Image URI before append:', imageUri);
      formData.append('Image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: `product-${Date.now()}.jpg`,
      } as any);
    }

    const product: Product = await apiCall(ENDPOINTS.CREATE, {
      method: 'POST',
      body: formData,
    });

    console.log('Product created successfully:', product);
    return convertToProductDisplay(product);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (
  itemId: string,
  updatedData: Partial<CreateProductRequest>,
  imageUri?: string | null
): Promise<ProductDisplay> => {
  try {
    const formData = new FormData();
    formData.append('ProductName', updatedData.productName!);
    formData.append('Quantity', updatedData.quantity!.toString());
    formData.append('ExpirationDate', updatedData.expirationDate!);
    formData.append('CategoryId', updatedData.categoryId!.toString());

    if (imageUri) {
      formData.append('Image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: `product-${Date.now()}.jpg`,
      } as any);
    } else {
      formData.append('Image', '');
    }

    const product: Product = await apiCall(`${ENDPOINTS.UPDATE}/${itemId}`, {
      method: 'PATCH',
      body: formData,
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
