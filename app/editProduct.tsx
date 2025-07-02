import { useProducts } from '@/contexts/ProductContext';
import { CATEGORIES, Product } from '@/types/interfaces';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAlert } from '@/hooks/useCustomAlert';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

export default function EditProductScreen() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const { productId } = useLocalSearchParams();
  const { products, updateProduct } = useProducts();
  const { showAlert } = useAlert();

  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const currentProduct = products.find(
      (product) => product.itemId === productId
    );

    if (currentProduct) {
      setProductName(currentProduct.productName);
      setQuantity(currentProduct.quantity.toString());
      setExpirationDate(new Date(currentProduct.expirationDate));
      setCategoryId(currentProduct.categoryId);
      if (currentProduct.imageUrl) {
        setSelectedImageUri(currentProduct.imageUrl);
      }
    }
  }, [products, productId]);

  const handleUpdate = async () => {
    if (!productName.trim()) {
      showAlert({
        title: 'Error',
        message: 'Please enter a product name',
      });
      return;
    }

    const quantityNum = parseInt(quantity);
    if (!quantity.trim() || isNaN(quantityNum) || quantityNum <= 0) {
      showAlert({
        title: 'Error',
        message: 'Please enter a valid quantity (greater than 0)',
      });
      return;
    }

    if (!categoryId) {
      showAlert({
        title: 'Error',
        message: 'Please select a category',
      });
      return;
    }

    try {
      setLoading(true);

      const updatedData: Partial<Product> = {
        productName,
        quantity: quantityNum,
        expirationDate: expirationDate.toISOString(),
        categoryId,
      };

      await updateProduct(productId as string, updatedData);
      showAlert({
        title: 'Success',
        message: 'Product updated successfully',
      });
      router.back();
    } catch {
      showAlert({
        title: 'Error',
        message: 'Failed to update product. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-gray-50 dark:bg-gray-900'>
      {/* Header */}
      <View className='bg-transparent border-b border-gray-200 dark:border-gray-700'>
        <View className='flex-row items-center justify-between px-4 py-3'>
          <TouchableOpacity onPress={() => router.back()} className='p-2'>
            <MaterialIcons
              name='arrow-back'
              size={24}
              color={isDarkMode ? 'gray' : 'black'}
            />
          </TouchableOpacity>

          <Text className='text-2xl font-semibold text-gray-900 dark:text-white'>
            Edit Product
          </Text>

          <View className='w-10' />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        <ScrollView className='flex-1 px-5 py-6'>
          {/* Image Section */}
          <View className='mb-4'>
            <Text className='text-base font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Product Image
            </Text>
            {selectedImageUri ? (
              <View className='relative'>
                <Image
                  source={{ uri: selectedImageUri }}
                  className='w-full h-48 rounded-lg bg-gray-200 dark:bg-gray-700'
                  resizeMode='cover'
                />
              </View>
            ) : (
              <View className='h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg justify-center items-center bg-gray-50 dark:bg-gray-800'>
                <View className='items-center'>
                  <MaterialIcons
                    name='image'
                    size={48}
                    color={isDarkMode ? '#6B7280' : '#9CA3AF'}
                  />
                  <Text className='text-gray-500 dark:text-gray-400 mt-2'>
                    No image available
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Product Name Input */}
          <View className='mb-4'>
            <Text className='text-base font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Product Name
            </Text>
            <TextInput
              className='bg-white dark:bg-gray-800 p-4 rounded-lg text-gray-800 dark:text-white'
              placeholder='Enter product name'
              placeholderTextColor='#9CA3AF'
              value={productName}
              onChangeText={setProductName}
            />
          </View>

          {/* Quantity Input */}
          <View className='mb-4'>
            <Text className='text-base font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Quantity
            </Text>
            <TextInput
              className='bg-white dark:bg-gray-800 p-4 rounded-lg text-gray-800 dark:text-white'
              placeholder='Enter quantity'
              placeholderTextColor='#9CA3AF'
              value={quantity}
              onChangeText={setQuantity}
              keyboardType='numeric'
            />
          </View>

          {/* Category Input */}
          <View className='mb-4 relative z-10'>
            <Text className='text-base font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Category
            </Text>

            <TouchableOpacity
              className='bg-white dark:bg-gray-800 p-4 rounded-lg flex-row justify-between items-center'
              onPress={() => setDropdownOpen((prev) => !prev)}
            >
              <Text className='text-gray-400 dark:text-white'>
                {categoryId
                  ? CATEGORIES.find((cat) => cat.categoryId === categoryId)
                      ?.categoryName
                  : 'Select category'}
              </Text>
              <MaterialIcons name='arrow-drop-down' size={24} color='#9CA3AF' />
            </TouchableOpacity>

            {dropdownOpen && (
              <View className='absolute top-[90%] left-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg mt-2 shadow-lg z-20'>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.categoryId}
                    className='p-4 border-b border-gray-200 dark:border-gray-700'
                    onPress={() => {
                      setCategoryId(cat.categoryId);
                      setDropdownOpen(false);
                    }}
                  >
                    <Text className='text-gray-600 dark:text-white'>
                      {cat.categoryName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Expiration Date */}
          <View className='mb-4'>
            <Text className='text-base font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Expiration Date
            </Text>
            <TouchableOpacity
              className='bg-white dark:bg-gray-800 p-4 rounded-lg flex-row justify-between items-center'
              onPress={() => setShowDatePicker(true)}
            >
              <Text className='text-gray-400 dark:text-white'>
                {expirationDate.toLocaleDateString()}
              </Text>
              <MaterialIcons name='calendar-today' size={20} color='#9CA3AF' />
            </TouchableOpacity>
          </View>

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={expirationDate}
              mode='date'
              display='default'
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setExpirationDate(selectedDate);
                }
              }}
              minimumDate={new Date()}
            />
          )}

          {/* Action Buttons */}
          <View className='flex-row gap-4 mt-6'>
            <TouchableOpacity
              className='flex-1 button-secondary border border-primary dark:bg-transparent p-4 rounded-lg'
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text className='text-center text-primary font-semibold'>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className='flex-1 button-primary p-4 rounded-lg'
              onPress={handleUpdate}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color='white' />
              ) : (
                <Text className='text-center text-white font-semibold'>
                  Update
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
