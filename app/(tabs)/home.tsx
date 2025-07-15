import ProductCard from '@/components/ProductCard';
import QuickActions from '@/components/QuickActions';
import { useProducts } from '@/contexts/ProductContext';
import { useAlert } from '@/hooks/useCustomAlert';
import { ProductDisplay } from '@/types/interfaces';
import { convertToProductDisplay } from '@/utils/productUtils';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Image,
  Platform,
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
  const userName = 'Cat';
  const router = useRouter();
  const { products, fetchProducts, deleteProduct } = useProducts();
  const { showAlert } = useAlert();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

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

  const handleLogout = () => {
    showAlert({
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      icon: 'alert-circle',
      buttons: [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            //Todo: Add logout logic here (clear tokens, etc.)
            router.replace('/login');
          },
        },
      ],
    });
  };

  // Calculate the negative margin to extend image to top of screen
  const imageMarginTop =
    Platform.OS === 'ios' ? -insets.top : -(StatusBar.currentHeight ?? 0);

  return (
    <SafeAreaView className='flex-1 bg-gray-50 dark:bg-gray-900'>
      <StatusBar
        barStyle='light-content'
        backgroundColor='transparent'
        translucent={true}
      />
      <View className=' items-center'>
        <Image
          source={require('@/assets/images/Fridge_image.webp')}
          className='w-full h-80 position-absolute top-0 left-0 right-0'
          resizeMode='cover'
          style={{ marginTop: imageMarginTop }}
        />
        <View
          className='absolute top-0 left-0 right-0 h-80 bg-black opacity-40'
          style={{ marginTop: imageMarginTop }}
        />
        <View
          className='absolute top-0 left-0 right-0 h-72 items-center justify-between flex-row px-5'
          style={{ marginTop: imageMarginTop }}
        >
          <Text
            className='text-3xl font-bold text-white flex-1 text-center'
            style={{ paddingTop: insets.top + 20 }}
          >
            FridgePal
          </Text>
        </View>
      </View>
      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className='px-5 py-6'>
          <View className='flex-row items-center justify-between mb-4'>
            <Text className='text-3xl font-bold text-gray-800 dark:text-white'>
              Welcome, {userName}!
            </Text>
            <TouchableOpacity
              onPress={handleLogout}
              className='bg-red-500 px-3 py-2 rounded-md w-20 items-center'
            >
              <Text className='text-white text-sm font-bold'>Logout</Text>
            </TouchableOpacity>
          </View>
          <Text className='text-base text-gray-600 mt-1 dark:text-gray-300'>
            Keep your food fresh.
          </Text>
          <Text className='text-sm text-gray-600 mt-1 dark:text-gray-300'>
            Manage your fridge inventory effortlessly.
          </Text>
        </View>

        <QuickActions />

        <View className='px-5 mb-16'>
          <Text className='text-xl font-semibold text-gray-800 mb-4 dark:text-white'>
            Expiring Products
          </Text>
          {expiringProducts.map((product, index) => (
            <ProductCard
              key={product.itemId}
              product={product}
              isFirstCard={index === 0}
              onDelete={() => handleDeleteProduct(product)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
