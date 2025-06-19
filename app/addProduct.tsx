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

  // Form state
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Handle form submission
  const handleSave = () => {
    // Validation
    if (!productName.trim()) {
      Alert.alert('Error', 'Please enter a product name');
      return;
    }
    if (!category.trim()) {
      Alert.alert('Error', 'Please select a category');
      return;
    }

    // Create product object
    const newProduct = {
      id: Date.now().toString(), // Temporary ID
      name: productName,
      category: category,
      expirationDate: expirationDate.toISOString(),
      daysUntilExpiry: calculateDaysUntilExpiry(expirationDate),
    };

    // TODO: Save to database
    console.log('New product:', newProduct);

    // For now, just navigate back
    Alert.alert('Success', 'Product added successfully!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  // Calculate days until expiry
  const calculateDaysUntilExpiry = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(date);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <SafeAreaView className='flex-1 bg-gray-50 dark:bg-gray-900'>
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
          <View className='mb-6'>
            <Text className='text-base font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Category
            </Text>
            <TextInput
              className='bg-white dark:bg-gray-800 p-4 rounded-lg text-gray-800 dark:text-white'
              placeholder='Enter category (e.g., Dairy, Meat, Vegetables)'
              placeholderTextColor='#9CA3AF'
              value={category}
              onChangeText={setCategory}
            />
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
              <Text className='text-gray-800 dark:text-white'>
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
              className='flex-1 bg-gray-300 dark:bg-gray-700 p-4 rounded-lg'
              onPress={() => router.back()}
            >
              <Text className='text-center text-gray-700 dark:text-gray-300 font-semibold'>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className='flex-1 bg-blue-500 p-4 rounded-lg'
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
