import { createProduct, getProducts } from '@/services/api';
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
  addProduct: (product: Product) => void;
}

const ProductContext = createContext({} as ProductContextValue);

export default function ProductProvider(props: PropsWithChildren) {
  const [products, setProducts] = useState<ProductDisplay[]>([]);

  const fetchProducts = async () => {
    const data = await getProducts();
    setProducts(data);
  };

  const addProduct = async (product: Product) => {
    const newProduct = await createProduct(product);
    setProducts((prev) => [...prev, newProduct]);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, addProduct }}>
      {props.children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
