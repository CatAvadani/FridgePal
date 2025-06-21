import ProductCard from '@/components/ProductCard';
import QuickActions from '@/components/QuickActions';
import { useProducts } from '@/contexts/ProductContext';
import { convertToProductDisplay } from '@/utils/convertToProductDisplay';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

export default function HomeScreen() {
  const userName = 'Cat';

  const { products } = useProducts();
  const insets = useSafeAreaInsets();

  const productDisplays = products.map(convertToProductDisplay);

  // Filter and sort products that are expiring within the next 10 days
  const expiringProducts = productDisplays
    .filter((p) => p.daysUntilExpiry <= 10)
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

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
      <View className='pb-2 items-center'>
        <Image
          source={require('@/assets/images/Fridge_image.png')}
          className='w-full h-80 position-absolute top-0 left-0 right-0'
          resizeMode='cover'
          style={{ marginTop: imageMarginTop }}
        />
        <View
          className='absolute top-0 left-0 right-0 h-80 bg-black opacity-40'
          style={{ marginTop: imageMarginTop }}
        />
        <View
          className='absolute top-0 left-0 right-0 h-72 items-center'
          style={{ marginTop: imageMarginTop }}
        >
          <Text
            className='text-3xl font-bold text-white'
            style={{ paddingTop: insets.top + 20 }}
          >
            FridgePal
          </Text>
        </View>
      </View>
      <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View className='px-5 py-6'>
          <Text className='text-3xl font-bold text-gray-800 dark:text-white'>
            Welcome, {userName}!
          </Text>
          <Text className='text-base text-gray-600 mt-1 dark:text-gray-300'>
            Keep your food fresh.
          </Text>
          <Text className='text-sm text-gray-600 mt-1 dark:text-gray-300'>
            Manage your fridge inventory effortlessly.
          </Text>
        </View>

        {/* Quick Actions Buttons */}
        <QuickActions />

        {/* Expiring Products List */}
        <View className='px-5 mb-6'>
          <Text className='text-xl font-semibold text-gray-800 mb-4 dark:text-white'>
            Expiring Products
          </Text>

          {expiringProducts.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
