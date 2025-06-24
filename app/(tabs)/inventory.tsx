import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/contexts/ProductContext';
import { CATEGORIES } from '@/types/interfaces';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function InventoryScreen() {
  const { products, fetchProducts } = useProducts();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    if (selectedCategoryId === null) return products;

    return products.filter(
      (product) => product.categoryId === selectedCategoryId
    );
  }, [products, selectedCategoryId]);

  const getCategoryName = (categoryId: number) => {
    return (
      CATEGORIES.find((category) => category.categoryId === categoryId)
        ?.categoryName || 'Unknown'
    );
  };

  const headerClassName = `flex-row items-center justify-between pb-3 ${
    Platform.OS === 'android' ? 'pt-10' : 'pt-0'
  }`;

  return (
    <SafeAreaView className='flex-1 bg-gray-50 dark:bg-gray-900'>
      <View className='bg-transparent  dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4'>
        <View className={headerClassName}>
          <TouchableOpacity onPress={() => router.back()} className='p-2'>
            <MaterialIcons name='arrow-back' size={24} color='#000' />
          </TouchableOpacity>
          <Text className='text-2xl font-bold text-gray-800 dark:text-white '>
            Inventory
          </Text>
          <View className='w-10' />
        </View>
      </View>

      {/* Category Filter Chips */}
      <View className='bg-gray-100 dark:bg-gray-800  px-4 py-2 '>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 0 }}
        >
          <TouchableOpacity
            onPress={() => setSelectedCategoryId(null)}
            className={`mr-3 px-4 py-2 rounded-full ${
              selectedCategoryId === null
                ? 'bg-primary'
                : 'bg-white dark:bg-gray-700'
            }`}
          >
            <Text
              className={`font-medium ${
                selectedCategoryId === null
                  ? 'text-white'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              All
            </Text>
          </TouchableOpacity>

          {/* Category Chips */}
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.categoryId}
              onPress={() => setSelectedCategoryId(category.categoryId)}
              className={`mr-3 px-4 py-2 rounded-full ${
                selectedCategoryId === category.categoryId
                  ? 'bg-primary'
                  : 'bg-white dark:bg-gray-700'
              }`}
            >
              <Text
                className={`font-bold ${
                  selectedCategoryId === category.categoryId
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {category.categoryName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        className='flex-1 p-4 mb-16'
        data={filteredProducts.filter(Boolean)}
        keyExtractor={(item) => item.itemId}
        renderItem={({ item }) => item && <ProductCard product={item} />}
        ListEmptyComponent={() => (
          <View className='flex-1 justify-center items-center py-8'>
            <MaterialIcons name='inventory' size={48} color='#9CA3AF' />
            <Text className='text-gray-500 dark:text-gray-400 text-lg mt-2'>
              {selectedCategoryId
                ? `No ${getCategoryName(selectedCategoryId).toLowerCase()} products found`
                : 'No products found'}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
