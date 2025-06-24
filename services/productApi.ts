import { initialProducts } from '@/data/mockData';
import { Product, ProductDisplay } from '@/types/interfaces';
import { convertToProductDisplay } from '@/utils/convertToProductDisplay';

let mockProducts: Product[] = [...initialProducts];
const delay = (ms = 300) => new Promise((res) => setTimeout(res, ms));

export const getProducts = async (): Promise<ProductDisplay[]> => {
  await delay();
  return mockProducts.map(convertToProductDisplay);
};

export const createProduct = async (
  newProduct: Product
): Promise<ProductDisplay> => {
  await delay();
  mockProducts.push(newProduct);
  return convertToProductDisplay(newProduct);
};

export const updateProduct = async (
  productId: string,
  updatedData: Partial<Product>
): Promise<ProductDisplay> => {
  await delay();

  const productIndex = mockProducts.findIndex(
    (product) => product.productId === productId
  );

  if (productIndex === -1) {
    throw new Error('Product not found');
  }

  mockProducts[productIndex] = {
    ...mockProducts[productIndex],
    ...updatedData,
  };

  return convertToProductDisplay(mockProducts[productIndex]);
};

export const deleteProduct = async (productId: string): Promise<void> => {
  await delay();

  const productIndex = mockProducts.findIndex(
    (product) => product.productId === productId
  );

  if (productIndex === -1) {
    throw new Error('Product not found');
  }

  mockProducts.splice(productIndex, 1);
};
