import { getExpiryColorClass } from '@/constants/getExpiryColorsClass';
import { useProducts } from '@/contexts/ProductContext';
import { convertToProductDisplay } from '@/utils/convertToProductDisplay';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  Platform,
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

        {/* Quick Actions */}
        <View className='px-5 mb-6'>
          <Text className='text-xl font-semibold text-gray-800 mb-4 dark:text-white'>
            Quick Actions
          </Text>
          <View className='flex-row gap-2'>
            <TouchableOpacity
              className='flex-1 flex-row items-center bg-white p-4 rounded-xl shadow-sm dark:bg-gray-800'
              onPress={() => router.push('/addProduct')}
              style={{ elevation: 3 }}
            >
              <View
                className='w-10 h-10 justify-center items-center bg-gray-100
              dark:bg-slate-800 rounded-lg mr-3'
              >
                <MaterialIcons name='add' size={24} color='#ff5733' />
              </View>
              <View className='flex-1'>
                <Text className='text-base  font-semibold text-gray-800 dark:text-white'>
                  Add Product
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              className='flex-1 flex-row items-center bg-white p-4 rounded-xl shadow-sm dark:bg-gray-800'
              onPress={() => router.push('/cameraScreen')}
              style={{ elevation: 3 }}
            >
              <View className='w-10 h-10 justify-center items-center bg-gray-100 rounded-lg mr-3 dark:bg-slate-800'>
                <MaterialIcons name='camera-alt' size={24} color='#ff5733' />
              </View>
              <View className='flex-1'>
                <Text className='text-base font-semibold text-gray-800 dark:text-white'>
                  Take Photo
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Expiring Products List */}
        <View className='px-5 mb-6'>
          <Text className='text-xl font-semibold text-gray-800 mb-4 dark:text-white'>
            Expiring Products
          </Text>

          {expiringProducts.map((product) => (
            <View
              key={product.productId}
              className='flex-row justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-lg mb-3'
            >
              <View className='flex-1'>
                <Text className='text-base font-medium text-gray-800 dark:text-white'>
                  {product.productName} ({product.quantity})
                </Text>
                <Text
                  className={`text-sm mt-1 ${getExpiryColorClass(product.daysUntilExpiry)}`}
                >
                  {product.daysUntilExpiry === 0
                    ? 'Expires today'
                    : product.daysUntilExpiry === 1
                      ? 'Expires tomorrow'
                      : `Expires in ${product.daysUntilExpiry} days`}
                </Text>
              </View>
              <MaterialIcons name='chevron-right' size={24} color='#999' />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
