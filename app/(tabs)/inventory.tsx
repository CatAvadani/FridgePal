import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/contexts/ProductContext';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';

export default function InventoryScreen() {
  const { products, fetchProducts } = useProducts();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }, [fetchProducts]);

  return (
    <SafeAreaView className='flex-1 bg-gray-50 dark:bg-gray-900'>
      <View className='bg-transparent  dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4'>
        <View className='flex-row items-center justify-between py-3 pt-5'>
          <TouchableOpacity onPress={() => router.back()} className='p-2'>
            <MaterialIcons name='arrow-back' size={24} color='#000' />
          </TouchableOpacity>
          <View className='w-10' />
        </View>
      </View>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className='p-4'
        data={products}
        keyExtractor={(item) => item.productId.toString()}
        renderItem={({ item }) => <ProductCard product={item} />}
      />
    </SafeAreaView>
  );
}
