import { useProducts } from '@/contexts/ProductContext';
import { useCallback, useState } from 'react';

export default function useRefreshProducts() {
  const [refreshing, setRefreshing] = useState(false);

  const { fetchProducts } = useProducts();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }, [fetchProducts]);

  return { refreshing, onRefresh };
}
