import ProductCard from '@/components/ProductCard';
import QuickActions from '@/components/QuickActions';
import { getUserDisplayName } from '@/constants/getUserDisplayName';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';
import { useAlert } from '@/hooks/useCustomAlert';
import { ProductDisplay } from '@/types/interfaces';
import { convertToProductDisplay } from '@/utils/productUtils';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { products, fetchProducts, deleteProduct } = useProducts();
  const { showAlert } = useAlert();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  const userName = getUserDisplayName(user);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  }, [fetchProducts]);

  const productDisplays = products.map(convertToProductDisplay);

  // Filter and sort products that are expiring within the next 10 days
  const expiringProducts = productDisplays
    .filter((p) => p.daysUntilExpiry <= 10)
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

  // Calculate dashboard stats
  const totalProducts = productDisplays.length;
  const expiringCount = expiringProducts.length;
  const expiredCount = productDisplays.filter(
    (p) => p.daysUntilExpiry < 0
  ).length;
  const freshCount = totalProducts - expiringCount;

  const handleDeleteProduct = async (
    product: ProductDisplay
  ): Promise<void> => {
    try {
      await deleteProduct(product.itemId);
      showAlert({
        title: 'Deleted!',
        message: 'Product deleted successfully.',
        icon: 'check-circle',
        buttons: [{ text: 'OK', style: 'default' }],
      });
    } catch {
      showAlert({
        title: 'Error',
        message: 'Failed to delete product. Please try again.',
        icon: 'alert-circle',
        buttons: [{ text: 'OK', style: 'default' }],
      });
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-gray-50 dark:bg-gray-900'>
      <StatusBar
        barStyle='dark-content'
        backgroundColor='transparent'
        translucent={true}
      />
      {/* Header above image */}
      <View className='flex-row items-center justify-between m-4'>
        <View className='flex-row items-center'>
          <View className='w-10 h-10 bg-primary rounded-full mr-3 justify-center items-center'>
            <Text className='text-white font-bold'>{userName.charAt(0)}</Text>
          </View>
          <View>
            <Text className='text-2xl font-bold text-gray-800 dark:text-white'>
              FridgePal
            </Text>
            <Text className='text-sm text-gray-500 dark:text-gray-400'>
              Welcome, {userName}!
            </Text>
          </View>
        </View>
        <View className='flex-row items-center space-x-3'>
          <TouchableOpacity>
            <Feather name='bell' size={24} color='#6B7280' />
          </TouchableOpacity>
          {/* <Text className='text-sm text-gray-500 bg-orange-100 px-3 py-1 rounded-full'>
            {totalProducts} items
          </Text> */}
        </View>
      </View>
      <Text className='text-left text-gray-500 dark:text-gray-400 mb-4 mx-4'>
        Keep track of your food and reduce waste!
      </Text>

      <View className='relative'>
        {/* Background Image */}
        <View className='h-48 mx-4 rounded-xl overflow-hidden'>
          <Image
            source={require('@/assets/images/Fridge_image.webp')}
            className='w-full h-full'
            resizeMode='cover'
          />
          {/* Light overlay for better contrast */}
          <View className='absolute inset-0 bg-black opacity-10' />

          {/* Optional: Category tags on image like fitness app */}
          <View className='absolute top-4 right-4'>
            <View className='bg-green-400 bg-opacity-30 px-3 py-1 rounded-full'>
              <Text className='text-black text-xs font-medium'>
                Keep Your Food Fresh{' '}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className='mt-4'>
          <QuickActions />
        </View>

        <View className='px-5 mb-16'>
          <View className='flex-row items-center justify-between mb-4'>
            <Text className='text-xl font-semibold text-gray-800 dark:text-white'>
              Expiring Products
            </Text>
            {expiringProducts.length === 0 && (
              <Text className='text-sm text-green-600 dark:text-green-400 font-medium'>
                All fresh! 🎉
              </Text>
            )}
          </View>

          {expiringProducts.length === 0 ? (
            <View className='bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800'>
              <Text className='text-center text-green-700 dark:text-green-300 font-medium'>
                Great job! No items expiring in the next 10 days.
              </Text>
              <Text className='text-center text-green-600 dark:text-green-400 text-sm mt-1'>
                Add more items to keep tracking your inventory.
              </Text>
            </View>
          ) : (
            expiringProducts.map((product, index) => (
              <ProductCard
                key={product.itemId}
                product={product}
                isFirstCard={index === 0}
                onDelete={() => handleDeleteProduct(product)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
