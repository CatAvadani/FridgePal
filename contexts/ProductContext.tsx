import {
  createProduct,
  deleteProduct as deleteProductApi,
  getProducts,
  updateProduct as updateProductApi,
} from '@/services/productApi';
import { Product, ProductDisplay } from '@/types/interfaces';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';

interface ProductContextValue {
  products: ProductDisplay[];
  fetchProducts: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (
    productId: string,
    updatedData: Partial<Product>
  ) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  loading: boolean;
}

const ProductContext = createContext({} as ProductContextValue);

export default function ProductProvider(props: PropsWithChildren) {
  const [products, setProducts] = useState<ProductDisplay[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Product) => {
    try {
      setLoading(true);
      const newProduct = await createProduct(product);
      setProducts((prev) => [...prev, newProduct]);
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (
    productId: string,
    updatedData: Partial<Product>
  ) => {
    try {
      setLoading(true);
      const updatedProduct = await updateProductApi(productId, updatedData);

      setProducts((prev) =>
        prev.map((product) =>
          product.productId === productId ? updatedProduct : product
        )
      );
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      setLoading(true);
      await deleteProductApi(productId);

      setProducts((prev) =>
        prev.filter((product) => product.productId !== productId)
      );
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        fetchProducts,
        updateProduct,
        deleteProduct,
        loading,
      }}
    >
      {props.children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
