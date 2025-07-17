import { notificationManager } from '@/services/notificationManager';
import {
  createProduct,
  deleteProduct as deleteProductApi,
  getProducts,
  updateProduct as updateProductApi,
} from '@/services/supabaseProductService';
import { CreateProductRequest, ProductDisplay } from '@/types/interfaces';
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from './AuthContext';

interface ProductContextValue {
  products: ProductDisplay[];
  fetchProducts: () => Promise<void>;
  addProduct: (
    productData: CreateProductRequest,
    imageUri?: string | null
  ) => Promise<void>;
  updateProduct: (
    itemId: string,
    updatedData: Partial<CreateProductRequest>
  ) => Promise<void>;
  deleteProduct: (itemId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ProductContext = createContext<ProductContextValue | undefined>(
  undefined
);

export default function ProductProvider({ children }: PropsWithChildren) {
  const [products, setProducts] = useState<ProductDisplay[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isLoading } = useAuth();

  const fetchProducts = useCallback(async () => {
    if (!user) {
      console.log('No user authenticated, skipping product fetch');
      setProducts([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching products for authenticated user:', user.email);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('[ProductContext] fetchProducts error:', error);
      setError('Failed to fetch products. Please try again.');
      setProducts([]);
      setLoading(false);
    }
  }, [user]);

  const addProduct = useCallback(
    async (productData: CreateProductRequest, imageUri?: string | null) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        setLoading(true);
        setError(null);

        const newProduct = await createProduct(productData, imageUri);

        // Schedule notification for the new product
        try {
          console.log(
            'Scheduling notification for new product:',
            newProduct.productName
          );
          await notificationManager.scheduleProductNotification(newProduct);
        } catch (notificationError) {
          console.warn('Failed to schedule notification:', notificationError);
        }

        await fetchProducts();
      } catch (error) {
        console.error('[ProductContext] addProduct error:', error);
        setError('Failed to add product. Please try again.');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts, user]
  );

  const updateProduct = useCallback(
    async (itemId: string, updatedData: Partial<CreateProductRequest>) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        setLoading(true);
        setError(null);

        const updatedProduct = await updateProductApi(itemId, updatedData);

        // Cancel old notifications and schedule new ones if expiration date changed
        if (updatedData.expirationDate) {
          try {
            console.log(
              'Rescheduling notification for updated product:',
              updatedProduct.productName
            );
            await notificationManager.cancelProductNotifications(itemId);
            await notificationManager.scheduleProductNotification(
              updatedProduct
            );
          } catch (notificationError) {
            console.warn(
              'Failed to reschedule notification:',
              notificationError
            );
          }
        }

        const refreshedProducts = await getProducts();
        setProducts(refreshedProducts);
      } catch (error) {
        console.error('[ProductContext] updateProduct error:', error);
        setError('Failed to update product.');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  const deleteProduct = useCallback(
    async (itemId: string) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        setLoading(true);
        setError(null);

        // Cancel notifications for the product being deleted
        try {
          console.log('Cancelling notifications for deleted product:', itemId);
          await notificationManager.cancelProductNotifications(itemId);
        } catch (notificationError) {
          console.warn('Failed to cancel notifications:', notificationError);
        }

        await deleteProductApi(itemId);
        setProducts((prev) =>
          prev.filter((product) => product.itemId !== itemId)
        );
      } catch (error) {
        console.error('[ProductContext] deleteProduct error:', error);
        setError('Failed to delete product. Please try again.');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (user) {
      console.log('User authenticated, fetching products');
      fetchProducts();
    } else {
      console.log('User not authenticated, clearing products');
      setProducts([]);
      setError(null);
    }
  }, [user, isLoading, fetchProducts]);

  const contextValue = useMemo(
    () => ({
      products,
      addProduct,
      fetchProducts,
      updateProduct,
      deleteProduct,
      loading,
      error,
    }),
    [
      products,
      addProduct,
      fetchProducts,
      updateProduct,
      deleteProduct,
      loading,
      error,
    ]
  );

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = (): ProductContextValue => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
