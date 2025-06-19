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
