import { initialProducts } from '@/data/mockData';
import { Product } from '@/types/interfaces';
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';

interface ProductContextValue {
  products: Product[];
  addProduct: (product: Product) => void;
}

const ProductContext = createContext({} as ProductContextValue);

export default function ProductProvider(props: PropsWithChildren) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = (product: Product) => {
    setProducts([...products, product]);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct }}>
      {props.children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
