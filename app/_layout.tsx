import AuthProvider from '@/contexts/AuthContext';
import ProductProvider from '@/contexts/ProductContext';
import { AlertProvider } from '@/hooks/useCustomAlert';
import 'core-js/actual/structured-clone';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';
import '../global.css';

// This hidden component forces Tailwind to include all the color utility classes used by getExpiryColorClass().
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
    <GestureHandlerRootView>
      <AuthProvider>
        <PaperProvider>
          <AlertProvider>
            <ProductProvider>
              <ExpiryColorPresets />

              <Stack>
                <Stack.Screen
                  name='index'
                  options={{ headerShown: false, title: 'Welcome' }}
                />

                <Stack.Screen name='login' options={{ headerShown: false }} />
                <Stack.Screen
                  name='register'
                  options={{ headerShown: false }}
                />

                <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
                <Stack.Screen
                  name='addProduct'
                  options={{
                    title: 'Add Product',
                    headerTitleAlign: 'center',
                    headerBackTitle: '',
                    headerShown: false,
                    headerTintColor: 'black',
                  }}
                />
                <Stack.Screen
                  name='editProduct'
                  options={{
                    title: 'Edit Product',
                    headerTitleAlign: 'center',
                    headerBackTitle: '',
                    headerShown: false,
                    headerTintColor: 'black',
                  }}
                />
                <Stack.Screen
                  name='cameraScreen'
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen name='+not-found' />
              </Stack>
              <StatusBar style='auto' />
            </ProductProvider>
          </AlertProvider>
        </PaperProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
