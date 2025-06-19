import ProductProvider from '@/contexts/ProductContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

// This hidden component forces Tailwind to include all the color utility classes used by getExpiryColorClass(). Since Tailwind relies on static class detection, dynamically generated class names won't be included unless they're explicitly used somewhere.
const ExpiryColorPresets = () => (
  <View className='hidden'>
    <Text className='text-red-700 dark:text-red-400' />
    <Text className='text-red-500 dark:text-red-300' />
    <Text className='text-orange-500 dark:text-orange-300' />
    <Text className='text-yellow-500 dark:text-yellow-300' />
    <Text className='text-green-500 dark:text-green-300' />
    <Text className='text-gray-400' />
  </View>
);

export default function RootLayout() {
  return (
    <ProductProvider>
      <ExpiryColorPresets />
      <Stack>
        <Stack.Screen
          name='(tabs)'
          options={{ headerShown: false, title: '' }}
        />
        <Stack.Screen
          name='addProduct'
          options={{
            title: 'Add Product',
            headerBackTitle: '',
            headerBackVisible: true,
          }}
        />
        <Stack.Screen
          name='scanProduct'
          options={{ title: 'Scan Product', headerBackTitle: '' }}
        />
        <Stack.Screen name='+not-found' />
      </Stack>
      <StatusBar style='auto' />
    </ProductProvider>
  );
}
