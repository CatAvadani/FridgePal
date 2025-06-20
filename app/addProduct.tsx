import { useProducts } from '@/contexts/ProductContext';
import { CATEGORIES, Product } from '@/types/interfaces';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddProductScreen() {
  const router = useRouter();
  const { addProduct } = useProducts();

  const [productName, setProductName] = useState('');
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const handleSave = () => {
    if (!productName.trim()) {
      Alert.alert('Error', 'Please enter a product name');
      return;
    }

    if (!categoryId) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    // Create product object
    const newProduct: Product = {
      productId: Date.now().toString(),
      userId: '123',
      productName,
      quantity: 1,
      creationDate: new Date().toISOString(),
      expirationDate: expirationDate.toISOString(),
      notified: false,
      categoryId,
    };

    console.log('New product:', newProduct);

    try {
      addProduct(newProduct);
      Alert.alert('Success', 'Product added successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to add product. Please try again.');
      console.error('Error adding product:', error);
      return;
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-gray-50 dark:bg-gray-900'>
      {/* Custom Header */}
      <View className='bg-transparent dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
        <View className='flex-row items-center justify-between px-4 py-3'>
          <TouchableOpacity onPress={() => router.back()} className='p-2'>
            <MaterialIcons name='arrow-back' size={24} color='#000' />
          </TouchableOpacity>

          <Text className='text-2xl font-semibold text-gray-900 dark:text-white'>
            Add Product
          </Text>

          <View className='w-10' />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        <ScrollView className='flex-1 px-5 py-6'>
          {/* Product Name Input */}
          <View className='mb-6'>
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

          {/* Category Input */}
          <View className='mb-6 relative z-10'>
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
          <View className='mb-6'>
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
          <View className='flex-row gap-4 mt-8'>
            <TouchableOpacity
              className='flex-1 button-secondary border border-primary  dark:bg-gray-700 p-4 rounded-lg'
              onPress={() => router.back()}
            >
              <Text className='text-center text-primary dark:text-gray-300 font-semibold'>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className='flex-1 button-primary p-4 rounded-lg'
              onPress={handleSave}
            >
              <Text className='text-center text-white font-semibold'>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
