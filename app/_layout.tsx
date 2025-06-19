import ProductProvider from '@/contexts/ProductContext';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

export default function RootLayout() {
  return (
    <ProductProvider>
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
